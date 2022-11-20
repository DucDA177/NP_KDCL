angular.module('WebApiApp').factory('FactoryConstant', function () {
    return {
        DA_LAP_KE_HOACH_NGOAI: { FCode: 'DA_LAP_KE_HOACH_DG_NGOAI', FName: 'Đã lập kế hoạch đánh giá ngoài' },
        DANG_THUC_HIEN_KE_HOACH_NGOAI: { FCode: 'DANG_THUC_HIEN_KE_HOACH_DG_NGOAI', FName: 'Đang tiến hành kế hoạch đánh giá ngoài' },
        DANG_DUNG_KE_HOACH_NGOAI: { FCode: 'DANG_DUNG_KE_HOACH_DG_NGOAI', FName: 'Đang dừng kế hoạch đánh giá ngoài' },
        HOAN_THANH_KE_HOACH_NGOAI: { FCode: 'HOAN_THANH_KE_HOACH_DG_NGOAI', FName: 'Hoàn thành kế hoạch đánh giá ngoài' },
    };
});
