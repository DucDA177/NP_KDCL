angular.module('WebApiApp').factory('FactoryConstant', function () {
    return {
        //Trang thai ke hoach dgn
        DA_LAP_KE_HOACH_NGOAI: { FCode: 'DA_LAP_KE_HOACH_DG_NGOAI', FName: 'Đã lập kế hoạch đánh giá ngoài' },
        DANG_THUC_HIEN_KE_HOACH_NGOAI: { FCode: 'DANG_THUC_HIEN_KE_HOACH_DG_NGOAI', FName: 'Đang tiến hành kế hoạch đánh giá ngoài' },
        DANG_DUNG_KE_HOACH_NGOAI: { FCode: 'DANG_DUNG_KE_HOACH_DG_NGOAI', FName: 'Đang dừng kế hoạch đánh giá ngoài' },
        HOAN_THANH_KE_HOACH_NGOAI: { FCode: 'HOAN_THANH_KE_HOACH_DG_NGOAI', FName: 'Hoàn thành kế hoạch đánh giá ngoài' },
        //End Trang thai ke hoach dgn
      //Trang thai Bao cao
        DANG_SOAN: { FCode: 'DANG_SOAN', FName: 'Đang soạn' },
        HOAN_THANH: { FCode: 'HOAN_THANH', FName: 'Hoàn thành' },
        //End Trang thai Bao cao
    };
});
