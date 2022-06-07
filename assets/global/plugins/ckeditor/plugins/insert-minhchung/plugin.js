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
                    label: 'Chọn minh chứng', // The text that appears in the richcombo when nothing is selected

                    title: 'Thêm đường dẫn minh chứng', // The control's tooltip
                    toolbar: 'insert',

                    multiSelect: true, // Only one item can be selected at a time

                    panel: { // This is necessary
                        css: [CKEDITOR.getUrl('skins/moono-lisa/editor.css')],
                        multiSelect: true
                    },

                    init: function () { // Called only on the first drop-down

                        let DSMinhChung = JSON.parse(localStorage.getItem('DSMinhChung'))

                        if (DSMinhChung) {
                            for (let i = 0; i < DSMinhChung.length; i++) {
                                this.add(DSMinhChung[i].Id + delim + DSMinhChung[i].Ma,
                                    DSMinhChung[i].Ma + ' | ' + DSMinhChung[i].TenMinhChung,
                                    DSMinhChung[i].TenMinhChung);
                            }
                        }
                        
                    },
                    onClick: function (value) {

                        editor.focus();

                        var item = value.split(delim);
                        var id = item[0];
                        var name = item[1];
                        var v = "<a class='link-minhchung' href='javascript:void(0);' onclick='angular.element(document.body).scope().OpenViewMinhChung(" + id + ")' id = '" + id + "' >[" + name + "]</a>";

                        editor.insertHtml(v);
                        editor.fire('saveSnapshot');

                        $(".cke_combopanel").css({ "display": "" });
                    }
                })
        }
    });