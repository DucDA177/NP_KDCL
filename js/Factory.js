angular.module('WebApiApp').factory('FactoryConstant', function () {
    return {
        DA_CHUYEN_KE_HOACH_TDG: { FCode: 'DA_CHUYEN_KE_HOACH_TDG', FName: 'Đã chuyển kế hoạch' },
        DA_LAP_KE_HOACH_NGOAI: { FCode: 'DA_LAP_KE_HOACH_NGOAI', FName: 'Đã lập kế hoạch ngoài' },
        DANG_THUC_HIEN_KE_HOACH_NGOAI: { FCode: 'DANG_THUC_HIEN_KE_HOACH_NGOAI', FName: 'Đang thực hiện kế hoạch ngoài' },
        DANG_DUNG_KE_HOACH_NGOAI: { FCode: 'DANG_DUNG_KE_HOACH_NGOAI', FName: 'Đang tạm dừng kế hoạch ngoài' },
        HOAN_THANH_KE_HOACH_NGOAI: { FCode: 'HOAN_THANH_KE_HOACH_NGOAI', FName: 'Hoàn thành kế hoạch ngoài' },

    };
});
