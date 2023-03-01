import { useSnackbar } from "notistack";
import { useCallback } from "react";

const useCustomSnackbar = ()=>{

  const { enqueueSnackbar } = useSnackbar();

  const showSnackbarAlert = useCallback((message, severity = 'info') => {
    const alertProps = {
      anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
      variant: severity,
      style:{minWidth: '360px'}
    }
    enqueueSnackbar(message,alertProps);
  },[enqueueSnackbar]);

  return {
    showSnackbarAlert,
  };
}

export default useCustomSnackbar;