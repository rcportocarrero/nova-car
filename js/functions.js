var url = window.location.origin + "/app.php";
function validaSesion(){
	jQuery.ajaxSetup({
        async: false,
        cache: false
    });

    jQuery.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        data: {
            action: 'logout',
        },
        success: function (data, textStatus, jQxhr) {
			//console.log('New chatbot.');
        },
        error: function (jqXhr, textStatus, errorThrown) {
            //console.log(errorThrown);
        }
    });
    return;
}
function sendLogin(userName,userEmail){
	jQuery.ajaxSetup({
        async: false,
        cache: false
    });

    jQuery.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        data: {
            action: 'login',
            userName: userName,
			//userEmail : userEmail
        },
        success: function (data, textStatus, jQxhr) {
			if(parseInt(jQxhr.status) === 200){
				responseMessage = urlify(data.text);
				jQuery('#body-message').html('');
				jQuery('.btn_inicia_chat').hide();
				jQuery('.bottom_wrapper').show();	
				printMessage(data.text, 'server');				
			}			
           
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(jQxhr.status);
        }
    });
    return;
}

function sendMessage(message) {
    jQuery.ajaxSetup({
        async: false,
        cache: false
    });

    jQuery.ajax({
        url: url,
        type: "GET",
        crossDomain: true,
        data: {
            action: 'question',
            formMessage: message
        },
        success: function (data, textStatus, jQxhr) {
            responseMessage = urlify(data.text);
			responseMessage.replace(/\\r\\n/g, "<br />");
			responseMessage.replace(/\n/ig, "<br />");
			
            if (data.boton !== undefined) {
                var optionButton = [];
                optionButton += '<div class="containerButtons"><div class="btn-group-vertical">';
                var arrayBoton = data.boton.split("|");
				var arrayBotonText = data.textback.split("|");
                for (var i = 0; i < arrayBoton.length; i++) {
                    optionButton += '<button type="button" class="btn btn-primary" onclick="selThis(this)" value="' + arrayBotonText[i] + '">' + arrayBoton[i] + '</button>';
                }
                optionButton += '</div></div>';
                responseMessage += '</br>' + optionButton;
            }
            printMessage(responseMessage, 'server');
        },
        error: function (jqXhr, textStatus, errorThrown) {
            console.log(errorThrown);
        }
    });
    return;
}

function evtKeypressStopEmail(evt) {
    if (evt.altKey === true) {
        evt.stopImmediatePropagation();
        return false;
    }
}

function selThis(objButton) {
    printMessage(objButton.value);
    sendMessage(objButton.value);
}

function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a href="' + url + '" target="_blank">' + url.substring(0, 30) + '...';
        +'</a>';
    });
}

function printMessage(message, user) {
    var liMessage = '';
    if (user === 'server') {
        liMessage += '<li class="message right appeared"><div class="text_wrapper corner_r"><div class="text">'+message+'</div></div></li>';
    } else {
        liMessage = '<li class="message left appeared"><div class="text_wrapper corner_l"><div class="text">'+message+'</div></div></li>';
    }
    jQuery("#body-message").append(liMessage);
    gotoBottom('dv_body');
}

function gotoBottom(id) {
    var element = document.getElementById(id);
    element.scrollTop = element.scrollHeight - element.clientHeight;
}

$(document).ready(function () {
	validaSesion();
    var btnSendMessage = jQuery('#btn-chat');
	var btnSendLogin = jQuery('#envia-chat');
	var txtUserName = jQuery('#nameChat');
	var txtUserEmail = jQuery('#emailChat');
	var txtMessageChat = jQuery('#btn-input');
	
	
	txtUserEmail.filter_input({regex: '[a-zA-Z0-9._@-]'});
	txtUserName.filter_input({regex: '[a-zA-Zá-úÁ-Ú-Úä-üÄ-Ü \'\"¨-]'});
	txtMessageChat.filter_input({regex: '[a-zA-Zá-úÁ-Ú-Úä-üÄ-Ü \'\"¨-]'});
	

	txtUserEmail.on("change paste keyup", function () {
        if ($(this).val().charAt(0) === ' ') {
            txtUserEmail.val('');
        }
    });
	
	txtUserName.on("change paste keyup", function () {
        if ($(this).val().charAt(0) === ' ') {
            txtUserName.val('');
        }
    });
	
	txtMessageChat.on("change paste keyup", function () {
        if ($(this).val().charAt(0) === ' ') {
            txtMessageChat.val('');
        }
    });
	
	jQuery('#btn-input').bind("enterKey",function(e){
		jQuery("#btn-chat").trigger( "click" );
	});
	jQuery('#btn-input').keyup(function(e){
		if(e.keyCode == 13)
		{
			$(this).trigger("enterKey");
		}
	});
	
	
    btnSendMessage.off('click');
    btnSendMessage.on('click', function (evt) {
        var txtMessage = jQuery('#btn-input').val();
        if (txtMessage !== ' ') {
            printMessage(txtMessage);
            jQuery('#btn-input').val('');
            sendMessage(txtMessage);
        }
    });
	
	btnSendLogin.off('click');
    btnSendLogin.on('click', function (evt) {
        var txtUserName = jQuery('#nameChat').val();
		var txtUserEmail = jQuery('#emailChat').val();
		sendLogin(txtUserName,txtUserEmail);
    });
	
});

$(document).on('click', '.panel-heading span.icon_minim', function (e) {
    var $this = $(this);
    if (!$this.hasClass('panel-collapsed')) {
        $this.parents('.panel').find('.panel-body').slideDown();
        $this.addClass('panel-collapsed');
        $this.removeClass('glyphicon-chevron-up').addClass('glyphicon-chevron-down');
    } else {
        $this.parents('.panel').find('.panel-body').slideUp();
        $this.removeClass('panel-collapsed');
        $this.removeClass('glyphicon-chevron-down').addClass('glyphicon-chevron-up');
    }
});