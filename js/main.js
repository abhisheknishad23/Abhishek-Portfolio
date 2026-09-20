$(function() {

    'use strict';

    $('.fakeLoader').fakeLoader({

        timeToHide: 1200, //Time in milliseconds for fakeLoader disappear

        zIndex: "999",//Default zIndex

        spinner: "spinner3",//Options: 'spinner1', 'spinner2', 'spinner3', 'spinner4', 'spinner5', 'spinner6', 'spinner7'

        bgColor: "#212121" //Hex, RGB or RGBA colors

    });
       
    // smooth scroll
    $("a").on("click", function(event) {

        if (this.hash !== "") {
            event.preventDefault();

            var hash = this.hash;

            $("html, body").animate({

                scrollTop: $(hash).offset().top - 50

            }, 850);

        }

    });

    // hide navbar on mobile after click
    $('.navbar-nav a').on('click', function() {
        $('.navbar-collapse').collapse('hide');
    });

    // carousel resume
    $('.owl-carousel').owlCarousel({
        items: 1,
        margin: 10
    });

    // collapse show on resume
    $('.collapse-show').collapse();

    // porfolio filterizr
    $('.filtr-container').imagesLoaded( function() {
        var filterizr = $('.filtr-container').filterizr();
    });

    // portfolio filter
    $('.portfolio-filter-menu li').on('click', function() {
        $('.portfolio-filter-menu li').removeClass('active');
        $(this).addClass('active');
    });

    // portfolio magnific popup
    $('.portfolio').each(function() { // the containers for all your galleries
        $(this).magnificPopup({
            delegate: '.portfolio-popup', // the selector for portfolio item
            type: 'image',
            gallery: {
                enabled: true
            }
        });
    });

    $('.portfolio-popup').magnificPopup({
    type: 'iframe', // Video file ke liye iframe enable karein
    iframe: {
        markup: '<div class="mfp-iframe-scaler">'+
                '<div class="mfp-close"></div>'+
                '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>'+
                '</div>'
    }
});

    // navbar on scroll
    $(window).on("scroll", function() {

        var vScroll = $(this).scrollTop();

        if( vScroll > 100) {
            $(".navbar").addClass("fix");
        }
        else {
            $(".navbar").removeClass("fix");
        }

    });


});


//contact form

document.getElementById('contact-form').addEventListener('submit', async function(event) {
    event.preventDefault(); //stop Default redirect 

    const form = event.target;
    const submitBtn = document.getElementById('submit');
    const originalBtnText = submitBtn.innerText;

    //update state button
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    try {
        const response = await fetch(form.action, {
            method: form.method,
            body: new FormData(form),
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success Popup Display
            Swal.fire({
                icon: 'success',
                title: 'Message Sent!',
                text: 'Thank you for reaching out. I will get back to you soon.',
                confirmButtonColor: '#ff7b00',
                background: '#1f1f1f',
                color: '#ffffff'
            });

            form.reset(); // Form clear kar dega
        } else {
            throw new Error('Form submission failed');
        }
    } catch (error) {
        // Error Popup Display
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong! Please try again later.',
            confirmButtonColor: '#d33',
            background: '#1f1f1f',
            color: '#ffffff'
        });
    } finally {
        submitBtn.innerText = originalBtnText;
        submitBtn.disabled = false;
    }
});


//ai chatbot

    const chatBox = document.getElementById('chat-box');
    const toggleBtn = document.getElementById('chat-toggle-btn');
    const closeBtn = document.getElementById('chat-close-btn');
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatLogs = document.getElementById('chat-logs');

    // Toggle Chat Window Open/Close
    toggleBtn.addEventListener('click', () => chatBox.classList.toggle('chat-box-hidden'));
    closeBtn.addEventListener('click', () => chatBox.classList.add('chat-box-hidden'));

    async function sendMessage() {
        const text = userInput.value.trim();
        if (!text) return;

        // User Message Display 
        chatLogs.innerHTML += `<div class="msg user-msg">${text}</div>`;
        userInput.value = '';
        chatLogs.scrollTop = chatLogs.scrollHeight;

        // AI Thinking Indicator Append 
        const typingMsg = document.createElement('div');
        typingMsg.className = 'msg ai-msg';
        typingMsg.innerText = 'Thinking...';
        chatLogs.appendChild(typingMsg);
        chatLogs.scrollTop = chatLogs.scrollHeight;

        try {
            //
            const response = await fetch('http://127.0.0.1:8000/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            if (data.reply) {
            // Clean up unwanted symbols (Markdown cleanup)
            let formattedReply = data.reply
                .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>') // Converts **bold** to <b>bold</b>
                .replace(/###/g, '')                    //Removes ###
                .replace(/\|/g, ' ')                    //Removes table borders
                .replace(/---/g, '')                    //Removes horizontal dashes
                .replace(/\n/g, '<br>');                //Converts newlines to line breaks

            typingMsg.innerHTML = formattedReply; // innerText ki jagah innerHTML use karein
            } else {
                typingMsg.innerText = "Sorry, I couldn't process that right now.";
            }

        } catch (err) {
            console.error(err);
            typingMsg.innerText = "Abhishek is a Full-Stack AI & ML Engineer with expertise in Python, PyTorch, FastAPI, LLMs, and Computer Vision!";
        }

        chatLogs.scrollTop = chatLogs.scrollHeight;
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });





