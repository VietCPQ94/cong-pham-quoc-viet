import { signify } from "react-signify";

type TControl = {
  pickCoinProcess: {
    isShow: boolean;
    type: string;
  };
};

const sControl = signify<TControl>({
  pickCoinProcess: {
    isShow: false,
    type: "",
  },
});

export default sControl;
