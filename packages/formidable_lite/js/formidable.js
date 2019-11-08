var ccmFormidableAddressStates = '';
var ccmFormidableAddressStatesToCountries = '';

var ccmFormidableTranslate = function(s, v) {
	return I18N_FF && I18N_FF[s] ? (I18N_FF[s].replace('%s', v) || s) : s;
};

ccmFormidableUpdateDependency = function(selector, arguments) {
		
	var eObj = $('[name="'+selector+'"]');
	if (!eObj.length) eObj = $('[name^="'+selector+'["]');	
	if (!eObj.length) eObj = $('[id="'+selector+'"]');			
	if (eObj.length <= 0) return false;
	
	var tagName = eObj.get(0).tagName.toLowerCase();	
	var typeName = eObj.attr('type');
	
	for (var i=0; i<arguments.length; i++) {
		switch (arguments[i][0]) {				
			case 'disable':			
				eObj.attr('disabled', true);
			break;			
			case 'enable':			
				eObj.attr('disabled', false);
			break;			
			case 'show':			
				if (eObj.closest('.element').length > 0) eObj.closest('.element').slideDown();
				else eObj.slideDown();	
			break;				
			case 'hide':			
				if (eObj.closest('.element').length > 0) eObj.closest('.element').slideUp();
				else eObj.slideUp();					
			break;			
			case 'value':		
				if (tagName == 'input' || tagName == 'textarea' || tagName == 'select') {
					if (typeName == 'checkbox' || typeName == 'radio') {
						var _argument = arguments[i][1];
						eObj.each(function(j, eObjItem) {							
							if ($(eObjItem).val() == _argument) $(eObjItem).attr('checked', false).trigger('click');								
						});
					} else eObj.val(arguments[i][1]).trigger('change');
				}
			break;			
			case 'class':
				eObj.removeClass(arguments[i][1]);
				if (arguments[i][2] == 'add') eObj.addClass(arguments[i][1]);
			break;	
		}
	}		
};

// Formidable plugin
;(function($) {
    $.fn.formidable = function(options) {
    	options = $.extend({
            'error_messages_on_top': false,
            'error_messages_on_top_class': 'alert alert-danger',
            'warning_messages_class': 'alert alert-warning',
	        'error_messages_beneath_field': true,
	        'error_messages_beneath_field_class': 'text-danger error',
	        'success_messages_class': 'alert alert-success',
	        'remove_form_on_success': true,
        }, options);
	 
	 	var formObj = this;
	 	var formID = $('input[id="formID"]', formObj).val();
	 	var formContainer = $('#formidable_container_'+formID);

	 	if (!formObj.length) {
            return false;
        }

	    var initialize = function() {

	    	tooltip();
	    	resolution();
	    	countable();
			setup_options();

		    $('form[name="formidable_form"], input[type="submit"], input[type="button"]', formObj).on('click touchstart', function(e) {
		        e.preventDefault(); 
				submit($(this).attr('id'));
		    });
			
			$('input:not([type="file"]), textarea, select', formObj).on('keyup, keydown, change', function() {
		    	clear_error($(this));
			});
			$('input[type="checkbox"], input[type="radio"]', formObj).on('click touchstart', function() {
				clear_error($(this));
			});
					
			$('input[type="radio"]', formObj).on('click touchstart', function(){
				$('input[name="' + $(this).attr('name') + '"]').not($(this)).trigger('deselect');
			});

			// Add placeholders if exists
			if ($.fn.addPlaceholder) {
				$('input[placeholder], textarea[placeholder]', formObj).addPlaceholder();
			}

			if (typeof ccmFormidableAddressStatesTextList !== 'undefined') {
				ccmFormidableAddressStates = ccmFormidableAddressStatesTextList.split('|');	
			}

			$('select.country_select', formObj).each(function() {
				setup_state_province_selector($(this).data('name'));	
			});

			$('input[name="ccmCaptchaCode"]', formObj).attr('id', 'ccmCaptchaCode');
	    };

	    var submit = function(action) {
	    	
	    	// Add this element for the controller
			$('input[id="action"]', formObj).remove();
			formObj.append($('<input>').attr({'name': 'action', 'id': 'action', 'value':action, 'type':'hidden'}));	

			// Start submission
			var data = formObj.serialize();	
			$.ajax({ 
				type: "POST",
				url: formObj.attr('action'),
				data: data,
				beforeSend: function() {
					loading();
					message();
					clear_errors();
				},
				success: function(data) {			
					
					// Show message if needed
					if (data.message) {
						message(data.message, 'warning');
					}
					
					// Errors on submission
					if (data.errors) {									
						var errors = [];
						$.each(data.errors, function(i, row) {						
							// Show error message beneath field.
							if (options.error_messages_beneath_field) {
								eObj = $('[id="'+row.handle+'"],[name="'+row.handle+'[]"],[name^="'+row.handle+'["]:last-child', formObj).eq(0);
								if (eObj.length > 0) {							
									$('[id="'+row.handle+'"],[id="'+row.handle+'_confirm"],[name="'+row.handle+'[]"],[name^="'+row.handle+'["]', formObj).addClass('error');

									var error = $('<span>').addClass(options.error_messages_beneath_field_class).text(row.message);
									$(eObj).closest('div.input').append(error.css('opacity', 0).animate({'opacity': 1}, 500));	
								}
							}
							errors.push(row.message);
						});
						message(errors, 'error');
						recaptcha();
						
						if (!!options.errorCallback && jQuery.isFunction(options.errorCallback)) {
							options.errorCallback.call(formObj,data);
						}
					} 
					
					if (data.success || data.redirect) {
						if (!!options.successCallback && jQuery.isFunction(options.successCallback)) {
							options.successCallback.call(formObj,data);
						}
					}

					// Redirect on submission
					if (data.redirect) {
						window.location.href = data.redirect;				
					}
					
					// Show success message
					if (data.success) {
						message(data.success, 'success');
						if (options.remove_form_on_success) {
							formObj.remove();
						}
					}

					if (data.clear) {
						if (!options.remove_form_on_success) {
							formObj.get(0).reset();
							initialize();
						}
					}

					loading();
					scroll();
				}
			});
				
			return false;	

	    };

	    var upload = function() {
	    	$('div.dropzone', formObj).each(function() {
				console.log($(this));
	    		$(this).dropzone.processQueue();
	    	});
	    }

	    var resolution = function() {
	    	var resolution = screen.width+'x'+screen.height;
			$('input[id="resolution"]', formObj).val(resolution);	
	    };

	    var tooltip = function() {
	    	if ($.fn.tooltip) {
	    		$('[data-toggle="tooltip"]').tooltip();
	    	}
	    };

	    var countable = function() {
	    	$('.counter', formObj).closest('.element').find('input, textarea').each(function() {
				var countable = $(this);
				var countable_id = $(this).attr('id');

				if ($(this).hasClass('counter_disabled')) {
					$(this).closest('.element').find('.counter').parent().remove();
				}
			    else {
					var counter = $('#'+countable_id+'_count');
					var type = $('#'+countable_id+'_counter').attr('type');
					var max = $('#'+countable_id+'_counter').attr('max');		
					
					if(type == 'value')
						max = $('#'+countable_id+'_counter').attr('max').length;			
					if (type == 'tags') {
						var current = $(this).next('div.tagsinput').find('span.tag').length;
						counter.text(max - current);				
					} else {
						$(this).simplyCountable({
							counter: counter,
							countType: type,
							maxCount: max,
							strictMax: true
						});	
					}
				}
			});
	    };

	    var loading = function(force) {	
			if (!force) force = false;
		
			var submit = $('input[type="submit"]', formObj);
			var button = $('input[type="button"]', formObj);
			var loader = $('.please_wait_loader', formObj);
			if (submit.hasClass('please_wait')) {
				if (force) return;
				submit.val(submit.attr('data-value')).attr({'disabled': false}).removeClass('please_wait');
				button.attr({'disabled': false}).removeClass('please_wait');
				loader.hide();
				
			} else {
				submit.attr({'data-value': submit.val(), 'disabled': true, value: ccmFormidableTranslate('Please wait...')}).addClass('please_wait');
				button.attr({'disabled': true}).addClass('please_wait');
				loader.css({display: 'inline-block'});	
			}
		};

		var setup_options = function() {
			$('select', formObj).find('option[value="option_other"]:selected').each(function() { 
				$(this).closest('.element').find('div.option_other').slideDown(); 
			});
			$('select', formObj).change(function() {
				if ($(this).find('option[value="option_other"]:selected').length > 0) $(this).closest('.element').find('div.option_other').slideDown();
				else $(this).closest('.element').find('div.option_other').slideUp();
			});
				
			$('input[value="option_other"]:checked', formObj).each(function() { 
				$(this).closest('.element').find('div.option_other').slideDown(); 
			});							
			$('input[type=radio]', formObj).click(function() {
				if ($(this).val() == 'option_other') $(this).closest('.element').find('div.option_other').slideDown();
				else $(this).closest('.element').find('div.option_other').slideUp();
			});
			
			$('input[type="checkbox"]', formObj).click(function() {
				var closed = true;
				$(this).closest('.element').find('input[type="checkbox"]:checked').each(function() {
					if ($(this).val() == 'option_other') closed = false;
				});
				if (!closed) $(this).closest('.element').find('div.option_other').slideDown();
				else $(this).closest('.element').find('div.option_other').slideUp();
			});
		};

		var clear_errors = function() {
			$('span.error', formObj).css('opacity', 1).animate({'opacity': 0}, 500, function() {
				$(this).remove();
			});
			$('.error:not(span)', formObj).removeClass('error');		
		};

		var clear_error = function(element) {
			element.removeClass('error').closest('.element').find('span.error').css('opacity', 1).animate({'opacity': 0}, 500, function() {
				$(this).remove();
			});
		};

		var message = function(message, type) {			
			var holder = $('#formidable_message_'+formID);
			if (holder.length <= 0) {
				holder = formObj.before($('<div>').attr('id', '#formidable_message_'+formID));
			}

			if (typeof message != 'undefined' && message.length > 0) {
				if (typeof message == 'object') {
					var temp = $('<div>');
					$.each(message, function(i, row) {
						temp.append($('<div>').html(row));
					});
					message = temp.html();
				}	

				if (type == 'success') holder.addClass(options.success_messages_class).removeClass('hide');				
				else if (type == 'warning') holder.addClass(options.warning_messages_class).removeClass('hide');
				else if (type == 'error') {			
					if (options.error_messages_on_top) {
						holder.addClass(options.error_messages_on_top_class).removeClass('hide');
					}
				}
				holder.html(message);
			}
			else holder.removeAttr('class').addClass('formidable_message hide').html('');			
		};

		var recaptcha = function() {
			var imgObj = $('img.ccm-captcha-image', formObj);
			if (imgObj.length > 0) imgObj.trigger('click');
			$('input[name=ccmCaptchaCode]', formObj).val('');	
		};

		var scroll = function() {
			if (formContainer.length > 0 && formContainer.height() > 0) {
				var window_height = $(window).height();
				var scroll_position = $(window).scrollTop();
				var element_position = formContainer.position().top;
				var element_height = formContainer.height();
				if(((element_position < scroll_position) || ((scroll_position + window_height) < element_position + element_height))) {
					$('html, body').animate({scrollTop: formContainer.offset().top}, 'slow');
				}
			}	
		};

		var address_select_country = function(cls, country) {
			var ss = $('select[id="' + cls + '[province]"]', formObj);
			var si = $('input[id="' + cls + '[province]"]', formObj);
			
			var foundStateList = false;
			ss.html("");
			if (ccmFormidableAddressStates) {
				for (j = 0; j < ccmFormidableAddressStates.length; j++) {
					var sa = ccmFormidableAddressStates[j].split(':');
					if ($.trim(sa[0]) == country) {
						if (!foundStateList) {
							foundStateList = true;
							si.attr('name', 'inactive_' + si.attr('ccm-attribute-address-field-name'));
							si.hide();
							ss.append('<option value="">'+ccmFormidableTranslate('Choose State/Province')+'</option>');
						}
						ss.show();
						ss.attr('name', si.attr('ccm-attribute-address-field-name'));		
						ss.append('<option value="' + $.trim(sa[1]) + '">' + $.trim(sa[2]) + '</option>');
					}
				}
				if (ss.attr('ccm-passed-value') != '') {
					$(function() {
						ss.find('option[value="' + ss.attr('ccm-passed-value') + '"]').attr('selected', true);
					});
				}
			}
			if (!foundStateList) {
				ss.attr('name', 'inactive_' + si.attr('ccm-attribute-address-field-name'));
				ss.hide();
				si.show();
				si.attr('name', si.attr('ccm-attribute-address-field-name'));		
			}
		};

		var setup_state_province_selector = function(cls) {	
			var cs = $('select[id="' + cls + '[country]"]', formObj);
			cs.change(function() {
				var v = $(this).val();
				address_select_country(cls, v);
			});
			if (cs.attr('ccm-passed-value') != '') {
				$(function() {
					cs.find('option[value="' + cs.attr('ccm-passed-value') + '"]').attr('selected', true);
					address_select_country(cls, cs.attr('ccm-passed-value'));
					var ss = $('select[id="' + cls + '[province]"]');
					if (ss.attr('ccm-passed-value') != '') {
						ss.find('option[value="' + ss.attr('ccm-passed-value') + '"]').attr('selected', true);
					}
				});
			}	
			address_select_country(cls, '');
		};

		initialize();

		return this;
	};
})(jQuery);