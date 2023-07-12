import { errorPopUp } from "../Components/Universal/AlertControl";
import { Alert } from "react-native";

/**
 * error: error from trycatch method.
 *
 * refreshFlag: flag to determine the data need to refresh.
 *
 * refreshCall: refresh data function, also can be navigation.pop().
 *
 * errorHandler: handle usual error response from back-end server.
 */
export function axiosErrorPreProcess(error: any, refreshFlag: boolean, refreshCall: () => void, errorHandler: (e: any) => void) {
  // TODO check if the request is store in here and if so store it in local storage async
  console.log(error.request);
  // NOTE Network issue => return by axios
  if (error.message === "Network Error") {
    return errorPopUp("E0117", undefined, [
      {
        text: "OK",
        onPress: () => (refreshFlag ? refreshCall() : null),
      },
    ]);
    // NOTE Did get response from back-end server
  } else if (error.status) {
    errorHandler(error);
    // NOTE handle exception not included in above conditions
  } else {
    return errorPopUp("E0117");
  }
}
