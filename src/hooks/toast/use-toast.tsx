
import * as React from "react";
import { ToasterToast, ToastBase, State } from "./types";
import { dispatch, getListeners, getState, subscribe } from "./toast-reducer";
import { genId } from "./toast-utils";

function toast(props: ToastBase) {
  const id = props.id || genId();

  const update = (props: Partial<ToasterToast>) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    });
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

  // Create a properly typed toast object with all required properties
  const toastProps: ToasterToast = {
    ...props,
    id,
    open: true,
    onOpenChange: (open) => {
      if (!open) dismiss();
    },
    onDismiss: dismiss,
  };

  dispatch({
    type: "ADD_TOAST",
    toast: toastProps,
  });

  return {
    id: id,
    dismiss,
    update,
  };
}

function useToast() {
  const [state, setState] = React.useState<State>(getState());

  React.useEffect(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };
}

export { useToast, toast };
