# WalletPage Optimize

## Refactor Code

Here is how we can fix and optimize this source for more better.

### Step 1 : add `export` feature in `WalletPage.tsx`

```tsx
export default WalletPage;
```

### Step 2 : Fix condition by `switchCase` to reduce complexity

**❌ Before**

```tsx
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
      return 20;
    case "Neo":
      return 20;
    default:
      return -99;
  }
};
```

**✅ After**

```tsx
// Step 2 : Fix condition by `switchCase` to reduce complexity
const getPriority = (blockchain: any): number =>
  ({
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  }[blockchain] ?? -99);
```

### Step 3 : move `getPriority` inside `sortedBalances` function

Because `getPriority` only use in `sortedBalances` function to prevent memory fragmentation.

**❌ Before**

```tsx
const getPriority = (blockchain: any): number =>
  ({
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  }[blockchain] ?? -99);

const sortedBalances = useMemo(() => {
  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false;
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });
}, [balances, prices]);
```

**✅ After**

```tsx
const sortedBalances = useMemo(() => {
  // Step 3 : move `getPriority` inside `sortedBalances` function
  const getPriority = (blockchain: any): number =>
    ({
      Osmosis: 100,
      Ethereum: 50,
      Arbitrum: 30,
      Zilliqa: 20,
      Neo: 20,
    }[blockchain] ?? -99);

  return balances
    .filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (lhsPriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false;
    })
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
    });
}, [balances, prices]);
```

### Step 4 : Sort missing return 0

0 value mean 2 value is equal.

**❌ Before**

```tsx
// << another Sources >>
sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }
});
```

**✅ After**

```tsx
// << another Sources >>
sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  if (leftPriority > rightPriority) {
    return -1;
  } else if (rightPriority > leftPriority) {
    return 1;
  }

  // Step 4 : Sort missing return 0
  return 0;
});
```

### Step 5 : Remove `prices` from useMemo's dependency list

Because `prices` not used by `sortedBalances` function

**❌ Before**

```tsx
const sortedBalances = useMemo(() => {
  // << function Sources >>
}, [balances, prices]);
```

**✅ After**

```tsx
const sortedBalances = useMemo(() => {
  // << function Sources >>
  // Step 5: Remove `prices` from useMemo's dependency list
}, [balances]);
```

## Step 6 : Fix Logic of filter

Because `lhsPriority` variable is not available.

**❌ Before**

```tsx
const sortedBalances = useMemo(() => {
  // << another Sources >>
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (lhsPriority > -99) {
      if (balance.amount <= 0) {
        return true;
      }
    }
    return false;
  });
  // << another Sources >>
}, [balances, prices]);
```

**✅ After**

```tsx
const sortedBalances = useMemo(() => {
  // << another Sources >>
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    // Step 6 : Fix Logic of filter
    if (balancePriority > -99) {
      if (balance.amount <= 0) {
        return true;
      }
    }
    return false;
  });
  // << another Sources >>
}, [balances, prices]);
```

## Step 7 : Fix Filter condition to reduce complexity

**❌ Before**

```tsx
const sortedBalances = useMemo(() => {
  // << another Sources >>
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    // Step 6 : Fix Logic of filter
    if (balancePriority > -99) {
      if (balance.amount <= 0) {
        return true;
      }
    }
    return false;
  });
  // << another Sources >>
}, [balances, prices]);
```

**✅ After**

```tsx
const sortedBalances = useMemo(() => {
  // << another Sources >>
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    // Step 7 : Fix Filter condition to reduce complexity
    return balancePriority > -99 && balance.amount <= 0;
  });
  // << another Sources >>
}, [balances, prices]);
```

## Step 8 : Remove useless code

In this step, we remove `formattedBalances` function

**❌ Before**

```tsx
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed(),
  };
});
```

**✅ After**

```tsx
// Step 8 : Remove useless code
// const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
//     return {
//         ...balance,
//         formatted: balance.amount.toFixed()
//     }
// })
```

## Step 9 : Fix `rows` execute bug

In case `sortedBalances` not change, but base functional component knowledge that it run all of sources when re-render processing and `sortedBalances` is no exception.

So in this case, simple way to fix it that adding `useMemo` with 2 dependencies is `sortedBalances` and `prices`

**❌ Before**

```tsx
const rows = sortedBalances.map(
  (balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  }
);
```

**✅ After**

```tsx
// Step 9 : Fix `rows` execute bug
const rows = useMemo(
  () =>
    sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }),
  [sortedBalances, prices]
);
```

## Step 10 : Fix key of Array Component

In each `WalletRow` still using array's `index` like `key` of array. This way is not good and effect re-render many time for all row when 1 row remove or add new. Let's assume that `sortedBalances` has an `id`, so we can use this `id` to naming for `key` variale. With unique `id`, React will be easy to manage and control all re-renders of the list.

**❌ Before**

```tsx
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

const rows = useMemo(
  () =>
    sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }),
  [sortedBalances, prices]
);
```

**✅ After**

```tsx
interface FormattedWalletBalance {
  // Step 10 : Fix key of Array Component
  id: string;
  currency: string;
  amount: number;
  formatted: string;
}

const rows = useMemo(
  () =>
    sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // Step 10 : Fix key of Array Component
          key={balance.id}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }),
  [sortedBalances, prices]
);
```

## Step 11 : Cache Component (React Hidden Feature)

React will reuse all components that were cached before. The simple way is to add React.memo for `WalletRow` to increase performance when managing the list.

**❌ Before**

```tsx
export default WalletRow;
```

**✅ After**

```tsx
import { memo } from "react";

export default memo(WalletRow);
```

## Conclusion

All of these steps are just a simple way to improve the performance of a React application. I will tell you more advanced ways directly in the interview stage.
