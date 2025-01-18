interface WalletBalance {
    currency: string;
    amount: number;
}
interface FormattedWalletBalance {
    // Step 10 : Fix key of Array Component
    id: string,
    currency: string;
    amount: number;
    formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
    const { children, ...rest } = props;
    const balances = useWalletBalances();
    const prices = usePrices();

    const sortedBalances = useMemo(() => {
        // Step 2 : Fix condition by `switchCase` to reduce complexity
        // Step 3 : move `getPriority` inside `sortedBalances` function
        const getPriority = (blockchain: any): number => ({
            'Osmosis': 100,
            'Ethereum': 50,
            'Arbitrum': 30,
            'Zilliqa': 20,
            'Neo': 20,
        })[blockchain] ?? -99;

        return balances.filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            // Step 6 : Fix Logic of filter
            // Step 7 : Fix Filter condition to reduce complexity
            return balancePriority > -99 && balance.amount <= 0;
        }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
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
        // Step 5: Remove `prices` from useMemo's dependency list
    }, [balances]);

    // Step 8 : Remove useless code
    // const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    //     return {
    //         ...balance,
    //         formatted: balance.amount.toFixed()
    //     }
    // })

    // Step 9 : Fix `rows` execute bug
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

    return (
        <div {...rest}>
            {rows}
        </div>
    )
}

// Step 1 : add `export` feature in `WalletPage.tsx`
export default WalletPage;