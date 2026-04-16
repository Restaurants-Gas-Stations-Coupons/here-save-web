import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchOutletAnalytics, fetchOutlets } from '../services/dashboardService';
import { fetchCoupons, createCoupon, updateCoupon, approveCoupon, rejectCoupon, deleteCoupon } from '../services/couponService';
import { fetchRedemptions } from '../services/redemptionService';
import { fetchEmployees, createEmployee, updateEmployee, deleteEmployee } from '../services/staffService';

const toArray = (payload) => (Array.isArray(payload) ? payload : []);

export const qk = {
  outlets: (params = {}) => ['outlets', params],
  outletAnalytics: (outletId, params = {}) => ['outlet-analytics', outletId, params],
  coupons: (params = {}) => ['coupons', params],
  redemptions: (params = {}) => ['redemptions', params],
  employees: (outletId) => ['employees', outletId],
};

export function useOutletsQuery(params = {}, options = {}) {
  return useQuery({
    queryKey: qk.outlets(params),
    queryFn: async () => {
      const res = await fetchOutlets(params);
      return toArray(res?.data ?? res);
    },
    ...options,
  });
}

export function useOutletAnalyticsQuery(outletId, params = {}, options = {}) {
  return useQuery({
    queryKey: qk.outletAnalytics(outletId, params),
    queryFn: () => fetchOutletAnalytics(outletId, params),
    enabled: Boolean(outletId),
    ...options,
  });
}

export function useCouponsQuery(params = {}, options = {}) {
  return useQuery({
    queryKey: qk.coupons(params),
    queryFn: async () => {
      const res = await fetchCoupons(params);
      return toArray(res?.data ?? res);
    },
    ...options,
  });
}

export function useRedemptionsQuery(params = {}, options = {}) {
  return useQuery({
    queryKey: qk.redemptions(params),
    queryFn: async () => {
      const res = await fetchRedemptions(params);
      return res || { redemptions: [], total_discount_amount: 0, discount_currency: null };
    },
    ...options,
  });
}

export function useEmployeesQuery(outletId, options = {}) {
  return useQuery({
    queryKey: qk.employees(outletId),
    queryFn: async () => {
      const res = await fetchEmployees(outletId);
      return toArray(res?.data ?? res);
    },
    enabled: Boolean(outletId),
    ...options,
  });
}

export function useCouponMutations() {
  const qc = useQueryClient();
  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ['coupons'] });
    qc.invalidateQueries({ queryKey: ['outlet-analytics'] });
    qc.invalidateQueries({ queryKey: ['redemptions'] });
  };
  return {
    createCoupon: useMutation({ mutationFn: createCoupon, onSuccess: invalidate }),
    updateCoupon: useMutation({
      mutationFn: ({ id, data }) => updateCoupon(id, data),
      onSuccess: invalidate,
    }),
    approveCoupon: useMutation({ mutationFn: approveCoupon, onSuccess: invalidate }),
    rejectCoupon: useMutation({
      mutationFn: ({ id, reason }) => rejectCoupon(id, reason),
      onSuccess: invalidate,
    }),
    deleteCoupon: useMutation({ mutationFn: deleteCoupon, onSuccess: invalidate }),
  };
}

export function useCreateEmployeeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createEmployee,
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['employees', vars?.outlet_id] });
    },
  });
}

export function useEmployeeMutations() {
  const qc = useQueryClient();
  const invalidateEmployees = (outletId) => {
    qc.invalidateQueries({ queryKey: ['employees', outletId] });
  };

  return {
    createEmployee: useMutation({
      mutationFn: createEmployee,
      onSuccess: (_, vars) => invalidateEmployees(vars?.outlet_id),
    }),
    updateEmployee: useMutation({
      mutationFn: ({ id, data }) => updateEmployee(id, data),
      onSuccess: (res, vars) => {
        const outletId = vars?.outlet_id ?? res?.data?.outlet_id;
        invalidateEmployees(outletId);
      },
    }),
    deleteEmployee: useMutation({
      mutationFn: ({ id }) => deleteEmployee(id),
      onSuccess: (_, vars) => {
        invalidateEmployees(vars?.outlet_id);
      },
    }),
  };
}
