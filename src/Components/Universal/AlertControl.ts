import { errorMessages, infoMessages } from "../../Constants/errorConst";
import { Alert, AlertButton, AlertOptions } from "react-native";
//Pop up an error dialog based on paramerter"Message Code"
//parameter:
//    messageCode: key of error message
//    parameters: message replacing message
//    buttons: customized buttons, can be null
//    options: customized features, can be null
//return: undefined
export const errorPopUp = (messageCode: string, parameters: string[] | undefined = undefined, buttons: AlertButton[] | undefined = undefined, options: AlertOptions | undefined = undefined) => {
  let errorMessage = errorMessages.find((e) => e.Code == messageCode);
  if (errorMessage) {
    if (parameters) {
      parameters.forEach(function (p, i) {
        errorMessage?.Message.replace(`[${i.toString()}]`, p);
      });
    }
    Alert.alert(errorMessage.Title, errorMessage.Message, buttons, options);
  } else {
    console.log(`error message "${messageCode}"cannot be find`);
  }
  return;
};
//Pop up an information and confirmation dialog based on paramerter"Message Code"
//parameter:
//    messageCode: key of information and confirmation message
//    buttons: customized buttons, can be null
//    options: customized features, can be null
//return: undefined
export const infoPopUp = (messageCode: string, parameters: string[] | undefined = undefined, buttons: AlertButton[] | undefined = undefined, options: AlertOptions | undefined = undefined) => {
  const infoMessage = infoMessages.find((e) => e.Code == messageCode);
  if (infoMessage) {
    Alert.alert(infoMessage.Title, infoMessage.Message, buttons, options);
  } else {
    console.log(`error message "${messageCode}"cannot be find`);
  }
  return;
};
