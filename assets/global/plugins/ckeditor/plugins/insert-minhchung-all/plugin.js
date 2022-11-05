var pluginName = 'insert-minhchung-all';
CKEDITOR.plugins.add(pluginName, {
    init: function (editor) {
        editor.addCommand('insertMinhChungAll', new CKEDITOR.dialogCommand('insertMinhChungAll'));

        editor.ui.addButton('InsertMinhChungAll', {
            label: 'Thêm minh chứng từ tiêu chí khác',
            title: 'Thêm minh chứng từ tiêu chí khác',
            command: 'insertMinhChungAll',
            toolbar: 'insert',
            icon: this.path + 'icons/add-new.jpg',
        });

        CKEDITOR.dialog.add('insertMinhChungAll', function (api) {
            let listCkb = [{
                type: 'html',
                html: '<p>Vui lòng chọn một hoặc nhiều minh chứng và nhấn Đồng ý</p>'
            }]
            let listSelectedCkb = []
            let DSMinhChung = JSON.parse(localStorage.getItem('DSMinhChungAll'))
            if (DSMinhChung) {
                for (let i = 0; i < DSMinhChung.length; i++) {

                    let objCkb = {
                        type: 'checkbox',
                        id: DSMinhChung[i].Id,
                        label: DSMinhChung[i].Ma + ' | ' + DSMinhChung[i].TenMinhChung,
                        onClick: function () {
                            if (this.getValue()) {
                                let check = listSelectedCkb.filter(t => t.Id == DSMinhChung[i].Id);
                                if (check.length == 0)
                                    listSelectedCkb.push({
                                        Id: DSMinhChung[i].Id,
                                        Ma: DSMinhChung[i].Ma
                                    })
                            }
                            else {
                                listSelectedCkb = listSelectedCkb.filter(t => t.Id != DSMinhChung[i].Id)
                            }

                        }
                    }
                    listCkb.push(objCkb)
                }
            }

            var dialogDefinition = {
                title: 'THÊM MINH CHỨNG',
                minWidth: 450,
                minHeight: 150,
                contents: [
                    {
                        id: 'tab1',
                        label: 'Label',
                        title: 'Title',
                        expand: true,
                        padding: 0,
                        elements: listCkb
                    }
                ],
                buttons: [CKEDITOR.dialog.okButton, CKEDITOR.dialog.cancelButton],
                onOk: function () {
                    for (let i = 0; i < listSelectedCkb.length; i++) {
                        var id = listSelectedCkb[i].Id;
                        var name = listSelectedCkb[i].Ma;
                        var v = "<a class='link-minhchung' href='javascript:void(0);' onclick='angular.element(document.body).scope().OpenViewMinhChung(" + id + ")' id = '" + id + "' >[" + name + "]</a>";
                        this._.editor.insertHtml(v);
                    }

                },
                onShow: function () {
                    listSelectedCkb = [];
                }
            };

            return dialogDefinition;
        });

    }
});
