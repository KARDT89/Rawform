import { trpc } from "~/trpc/client";

export const useSignup = () => {
  const utils = trpc.useUtils()
  const {
    mutateAsync: createUserWithEmailAndPasswordAsync,
    mutate: createUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.auth.createUserWithEmailAndPassword.useMutation({
    onSuccess: async () => await utils.auth.getLoggedInUserInfo.invalidate(),
  });
  return {
    createUserWithEmailAndPasswordAsync,
    createUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useLogin = () => {
  const utils = trpc.useUtils()
  const {
    mutateAsync: loginUserWithEmailAndPasswordAsync,
    mutate: loginUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  } = trpc.auth.loginWithEmailAndPassword.useMutation({
    onSuccess: async () => await utils.auth.getLoggedInUserInfo.invalidate(),
  });
  return {
    loginUserWithEmailAndPasswordAsync,
    loginUserWithEmailAndPassword,
    error,
    failureCount,
    isError,
    isIdle,
    isSuccess,
    status,
  };
};

export const useUser = () => {
  const {
    data: user,
    error,
    isFetched,
    isFetching,
    isLoading,
    status
  } = trpc.auth.getLoggedInUserInfo.useQuery();
  return {
    user,
    error,
    isFetched,
    isFetching,
    isLoading,
    status
  };
};
