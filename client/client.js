$(document).ready(() => {

    const handleError = (message) => {
        $("#errorMessage").text(message);
        $("#domoMessage").animate({width:'toggle'},350);
    }
    
    const sendAjax = (action, data) => {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: (result, status, xhr) => {
                $("#domoMessage").animate({width:'hide'},350);

                window.location = result.redirect;
            },
            error: (xhr, status, error) => {
                const messageObj = JSON.parse(xhr.responseText);
            
                handleError(messageObj.error);
            }
        });        
    }
    
    $("#signupSubmit").on("click", (e) => {
        e.preventDefault();
    
        $("#domoMessage").animate({width:'hide'},350);
    
        if($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
            handleError("There is a time and place for all fields that are required");
            return false;
        }
        
        if($("#pass").val() !== $("#pass2").val()) {
            handleError("There is a time and place for Passwords that need to match");
            return false;           
        }

        sendAjax($("#signupForm").attr("action"), $("#signupForm").serialize());
        
        return false;
    });

    $("#loginSubmit").on("click", (e) => {
        e.preventDefault();
    
        $("#domoMessage").animate({width:'hide'},350);
    
        if($("#user").val() == '' || $("#pass").val() == '') {
            handleError("There is a time and place for the Username or password");
            return false;
        }
    
        sendAjax($("#loginForm").attr("action"), $("#loginForm").serialize());

        return false;
    });
});