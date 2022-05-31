var pluginName = 'insert-minhchung';
var menuName = 'InsertMinhChung';
var minhchungURL = '/api/MinhChung/LoadFileMinhChung';
var delim = '~';

CKEDITOR.plugins.add(pluginName,
    {
        requires: ['richcombo'],

        init: function (editor) {
            editor.ui.addRichCombo(menuName,
                {
                    label: 'Chọn MC', // The text that appears in the richcombo when nothing is selected

                    title: 'Thêm đường dẫn minh chứng', // The control's tooltip

                    multiSelect: false, // Only one item can be selected at a time

                    panel: { // This is necessary
                        //css: [CKEDITOR.getUrl(editor.skinPath + 'editor.css')].concat(editor.config.contentsCss)
                    },

                    init: function () { // Called only on the first drop-down

                        let DSMinhChung = JSON.parse(localStorage.getItem('DSMinhChung'))

                        if (DSMinhChung) {
                            for (let i = 0; i < DSMinhChung.length; i++) {
                                this.add(DSMinhChung[i].Id + delim + DSMinhChung[i].Ma,
                                    DSMinhChung[i].Ma,
                                    DSMinhChung[i].TenMinhChung);

                            }
                        }


                    },

                    onClick: function (value) {
                        var item = value.split(delim);
                        var id = item[0];
                        var name = item[1];
                        var v = "<a class='link-minhchung' href='javascript:void(0);' onclick='angular.element(document.body).scope().OpenViewMinhChung(" + id + ")' >[" + name + "]</a>";

                        editor.fire('saveSnapshot');
                        editor.insertHtml(v);
                    }
                })
        }
    });