window.widop = window.widop || {};
window.widop.eventEmitter = window.widop.eventEmitter || new EventEmitter();

(function(widop, plupload, $, undefined) {

    /**
     * The widop plupload constructor.
     *
     * @param widgetSelector The widget selector.
     * @param options        The plupload options.
     *
     * @see http://www.plupload.com/documentation.php to see available options.
     */
    widop.plupload = function(widgetSelector, options) {

        /**
         * @var The widop plupload instance.
         */
        var that = this;

        /**
         * @var The plupload instance.
         */
        this.uploader = null;

        /**
         * @var The widop plupload CSS selectors, in order to manipulate the DOM with JS style it with CSS.
         *
         * The availables selectors are:
         *  - widget       Base selector.
         *  - container    Global div container of the widget.
         *  - browseButton Button used to choose the file to upload.
         *  - progressBar  Progress bar used to show upload status.
         *  - error        Error message.
         *  - picture      Picture displayed in case of a picture upload.
         */
        this.selectors = {};

        /**
         * @var The default plupload options.
         */
        this.options = {
            runtimes:      'html5,html4',
            max_file_size: '2mb',
            unique_names:  true,
            filters:[
                {
                    title:      ExposeTranslation.get('plupload.filters'),
                    extensions: 'jpg,png'
                }
            ]
        };

        $.extend(this.options, options);

        buildSelectors(widgetSelector);
        buildContainer();

        this.options.browse_button = this.selectors.browseButton;

        this.uploader = new plupload.Uploader(this.options);

        this.uploader.init();
        bindPluploadEvents();

        /**
         * Builds the widop plupload selectors.
         *
         * @param widgetSelector The widget base selector.
         */
        function buildSelectors(widgetSelector) {
            that.selectors.widget = widgetSelector;
            that.selectors.container = widgetSelector + '_container';
            that.selectors.browseButton = widgetSelector + '_browse_button';
            that.selectors.progressBar = widgetSelector + '_progress_bar';
            that.selectors.error = widgetSelector + '_error';
            that.selectors.picture = widgetSelector + '_picture';
            that.selectors.pictureRemove = that.selectors.picture + '_remove';
        }

        /**
         * Builds the plupload container and all the DOM elements needed to render the plupload.
         */
        function buildContainer() {
            var browseButtonHtml =
                '<button id="' + that.selectors.browseButton + '" class="btn">' +
                    '<i class="icon-upload"></i> ' + ExposeTranslation.get('plupload.button.upload') +
                '</button>';

            var progressHtml = '<div id="' + that.selectors.progressBar + '" class="progress progress-striped active span4" style="margin: 5px 0 0 0; display: none;">' +
                    '<div class="bar" style="width: 1%;"></div>' +
                '</div>';

            var errorHtml = '<span id="' + that.selectors.error + '" class="help-inline" style="display: none;">' + ExposeTranslation.get('plupload.error.upload') + '</span>';

            $('#' + that.selectors.container).append(browseButtonHtml);
            $('#' + that.selectors.container).append(progressHtml);
            $('#' + that.selectors.container).append(errorHtml);

            if (that.options.picture) {
                var pictureHtml = '<img id="' + that.selectors.picture + '" src="" alt="Uploaded picture" style="display: none;width: 500px;" />';
                var pictureRemoveHtml = '<button id="' + that.selectors.pictureRemove + '" style="display: none;">' + ExposeTranslation.get('plupload.button.remove') + '</button>';

                $('#' + that.selectors.container).append(pictureHtml);
                $('#' + that.selectors.container).append(pictureRemoveHtml);

                if (that.options.picture_path != null) {
                    showBuildedPicture(that.options.picture_path);
                } else if ($('#' + that.selectors.widget).val() != '') {
                    showBuildedPicture(that.options.upload_dir + '/' + $('#' + that.selectors.widget).val());
                } else {
                    widop.eventEmitter.emit('BuildContainer', that);
                }
            } else {
                widop.eventEmitter.emit('BuildContainer', that);
            }

            $(document).on('click', '#' + that.selectors.pictureRemove, function (event) {
                event.preventDefault();

                $('#' + that.selectors.picture).attr('src', null);

                $('#' + that.selectors.picture).hide();
                $('#' + that.selectors.pictureRemove).hide();

                $('#' + that.selectors.browseButton).fadeIn(200);
            });
        }

        /**
         * Shows the picture when it is builded.
         */
        function showBuildedPicture(picturePath) {
            $('#' + that.selectors.picture).attr('src', picturePath);

            $('#' + that.selectors.browseButton).hide();

            $('#' + that.selectors.picture).fadeIn(200, function () {
                widop.eventEmitter.emit('BuildContainer', that);
            });
            $('#' + that.selectors.pictureRemove).fadeIn(200);
        }

        /**
         * Binds the plupload events.
         */
        function bindPluploadEvents() {
            that.uploader.bind('FilesAdded', onFilesAdded);
            that.uploader.bind('UploadProgress', onUploadProgress);
            that.uploader.bind('FileUploaded', onFileUploaded);
            that.uploader.bind('Error', onError);
        }

        /**
         * This method is mapped to the plupload "FilesAdded" event.
         */
        function onFilesAdded(up, files) {
            $('#' + that.selectors.error).fadeOut(200);

            $('#' + that.selectors.browseButton).fadeOut(200, function() {
                $('#' + that.selectors.progressBar).fadeIn(200, function() {
                    that.uploader.start();

                    widop.eventEmitter.emit('FilesAdded', that, up, files);
                });
            });
        }

        /**
         * This method is mapped to the plupload "UploadProgress" event.
         */
        function onUploadProgress(up, file) {
            $('#' + that.selectors.progressBar + ' .bar').css('width', file.percent + '%');

            widop.eventEmitter.emit('UploadProgress', that, up, file);
        }

        /**
         * This method is mapped to the plupload "FileUploaded" event.
         */
        function onFileUploaded(up, file, info) {
            var response = $.parseJSON(info.response);

            $('#' + that.selectors.progressBar).fadeOut(200, function() {
                $('#' + that.selectors.browseButton).fadeOut(200, function () {
                    $('#' + that.selectors.widget).val(response.result);

                    if (that.options.picture) {
                        $('#' + that.selectors.picture).attr('src', that.options.upload_dir + '/' + response.result);
                        $('#' + that.selectors.picture).fadeIn(200, function () {
                            widop.eventEmitter.emit('FileUploaded', that, up, file, info);
                        });
                    } else {
                        widop.eventEmitter.emit('FileUploaded', that, up, file, info);
                    }
                });
            });
        }

        /**
         * This method is mapped to the plupload "Error" event.
         */
        function onError(up, error) {
            $('#' + that.selectors.progressBar).fadeOut(200, function() {
                $('#' + that.selectors.progressBar + ' .bar').css('width', '1%');

                $('#' + that.selectors.browseButton).fadeIn(200);
                $('#' + that.selectors.error).fadeIn(200, function () {
                    widop.eventEmitter.emit('Error', that, up, error);
                });
            });
        }
    };

})(window.widop, plupload, jQuery);
