import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkoutRunePack,
  fetchBillingSummary,
  fetchRuneLedger,
  fetchRunePacks,
  signupAccount,
  verifySignupEmail,
} from "@/api/commercial";
import { canSeeBilling } from "@/lib/authGuards";
import { isCommercialMock, type SignupPayload } from "@/lib/commercial";

const SUMMARY_KEY = ["commercial", "summary"] as const;

export function useBillingSummary() {
  const mock = isCommercialMock();
  return useQuery({
    queryKey: [...SUMMARY_KEY, mock ? "mock" : "live"],
    queryFn: fetchBillingSummary,
    enabled: typeof window !== "undefined" && canSeeBilling(),
    retry: false,
    staleTime: 30_000,
  });
}

export function useRuneLedger() {
  const mock = isCommercialMock();
  return useQuery({
    queryKey: ["commercial", "ledger", mock ? "mock" : "live"],
    queryFn: fetchRuneLedger,
    enabled: typeof window !== "undefined" && canSeeBilling(),
    retry: false,
    staleTime: 30_000,
  });
}

export function useRunePacks() {
  const mock = isCommercialMock();
  return useQuery({
    queryKey: ["commercial", "packs", mock ? "mock" : "live"],
    queryFn: fetchRunePacks,
    enabled: typeof window !== "undefined" && canSeeBilling(),
    retry: false,
    staleTime: 60_000,
  });
}

export function useSignupAccount() {
  return useMutation({
    mutationFn: (payload: SignupPayload) => signupAccount(payload),
  });
}

export function useVerifySignupEmail() {
  return useMutation({
    mutationFn: (token: string) => verifySignupEmail(token),
  });
}

export function useCheckoutRunePack() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (packId: string) => checkoutRunePack(packId),
    onSuccess: (result) => {
      if (result.mock) {
        void qc.invalidateQueries({ queryKey: ["commercial"] });
      }
    },
  });
}
