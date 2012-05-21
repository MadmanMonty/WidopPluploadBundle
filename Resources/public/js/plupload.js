window.widop = window.widop || {};
window.widop.eventEmitter = window.widop.eventEmitter || new EventEmitter();

(function(widop, plupload, $, undefined) {

    /**
     * @var The widop plupload instance.
     */
    var that;

    /**
     * The widop plupload constructor.
     *
     * @param widgetSelector The widget selector.
     * @param options        The plupload options.
     */
    widop.plupload = function(widgetSelector, options) {
        that = this;

        $.extend(that.options, options);

        _buildSelectors(widgetSelector);
        _buildContainer();

        that.options.browse_button = that.selectors.browseButton;

        that.uploader = new plupload.Uploader(that.options);

        bindPluploadEvents();
        that.uploader.init();
    };

    /**
     * @var The plupload instance.
     */
    widop.plupload.prototype.uploader = null;

    /**
     * @var The widop plupload selectors.
     *
     * The availables selectors are:
     *  - container
     *  - widget
     *  - browserButton
     *  - progressBar
     *  - error
     *  - picture
     */
    widop.plupload.prototype.selectors = {};

    /**
     * @var The default plupload options.
     */
    widop.plupload.prototype.options = {
        runtimes: 'html5,html4',
        max_file_size: '2mb',
        unique_names: true,
        filters: [{
            title: 'Select a file',
            extensions: 'jpg,png'
        }]
    };

    /**
     * Builds the widop plupload selectors.
     *
     * @param widgetSelector The widget selector.
     */
    var _buildSelectors = function (widgetSelector) {
        that.selectors.widget = widgetSelector;
        that.selectors.container = widgetSelector + '_container';
        that.selectors.browseButton = widgetSelector + '_browse_button';
        that.selectors.progressBar = widgetSelector + '_progress_bar';
        that.selectors.error = widgetSelector + '_error';
        that.selectors.picture = widgetSelector + '_picture';
        that.selectors.pictureRemove = that.selectors.picture + '_remove';
    };

    /**
     * Builds the plupload container.
     */
    var _buildContainer = function () {
        var browseButtonHtml =
            '<a id="' + that.selectors.browseButton + '" class="btn" href="#">' +
                '<i class="icon-upload"></i> Upload' +
            '</a>';

        var progressHtml = '<div id="' + that.selectors.progressBar + '" class="progress progress-striped active span4" style="margin: 5px 0 0 0; display: none;">' +
                '<div class="bar" style="width: 1%;"></div>' +
            '</div>';

        var errorHtml = '<span id="' + that.selectors.error + '" class="help-inline" style="display: none;">Error</span>';

        $('#' + that.selectors.container).append(browseButtonHtml);
        $('#' + that.selectors.container).append(progressHtml);
        $('#' + that.selectors.container).append(errorHtml);

        if (that.options.picture) {
            var pictureHtml = '<img id="' + that.selectors.picture + '" src="" alt="Uploaded picture" style="display: none;" />';
            var pictureRemoveHtml = '<a id="' + that.selectors.pictureRemove + '" href="#" style="display: none;">Remove</a>';

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
    };

    /**
     * Shows the picture when it is builded.
     */
    var showBuildedPicture = function (picturePath) {
        $('#' + that.selectors.picture).attr('src', picturePath);

        $('#' + that.selectors.browseButton).hide();

        $('#' + that.selectors.picture).fadeIn(200, function () {
            widop.eventEmitter.emit('BuildContainer', that);
        });
        $('#' + that.selectors.pictureRemove).fadeIn(200);
    };

    /**
     * Binds the plupload events.
     */
    var bindPluploadEvents = function () {
        that.uploader.bind('FilesAdded', function (up, files) {
            _filesAdded(up, files);
        });

        that.uploader.bind('UploadProgress', function (up, file) {
            _uploadProgress(up, file);
        });

        that.uploader.bind('FileUploaded', function (up, file, info) {
            _fileUploaded(up, file, info);
        });

        that.uploader.bind('Error', function (up, error) {
            _error(up, error);
        });
    }

    /**
     * This method is mapped to the plupload "FilesAdded" event.
     */
    var _filesAdded = function (up, files) {
        $('#' + that.selectors.error).fadeOut(200);

        $('#' + that.selectors.browseButton).fadeOut(200, function() {
            $('#' + that.selectors.progressBar).fadeIn(200, function() {
                that.uploader.start();

                widop.eventEmitter.emit('FilesAdded', that, up, files);
            });
        });
    };

    /**
     * This method is mapped to the plupload "UploadProgress" event.
     */
    var _uploadProgress = function (up, file) {
        $('#' + that.selectors.progressBar + ' .bar').css('width', file.percent + '%');

        widop.eventEmitter.emit('UploadProgress', that, up, file);
    };

    /**
     * This method is mapped to the plupload "FileUploaded" event.
     */
    var _fileUploaded = function (up, file, info) {
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
    };

    /**
     * This method is mapped to the plupload "Error" event.
     */
    var _error = function (up, error) {
        $('#' + that.selectors.progressBar).fadeOut(200, function() {
            $('#' + that.selectors.progressBar + ' .bar').css('width', '1%');

            $('#' + that.selectors.browseButton).fadeIn(200);
            $('#' + that.selectors.error).fadeIn(200, function () {
                widop.eventEmitter.emit('Error', that, up, error);
            });
        });
    };

})(window.widop, plupload, jQuery);
