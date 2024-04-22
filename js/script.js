$(function() {
    // const baseInviteUrl = "https://script.google.com/macros/s/AKfycbxBR8b-Hj2AeP2ClfSLPbEMqhRwcsZHU4CCxhGZkk8d59bEVo9Z1OuLOnUsGTXd6Adw/exec";
    const baseInviteUrl = "https://script.google.com/macros/s/AKfycbx2B85zsS-ET0TyrH2EppwigrL1vTQmuF3th0UxS_9k6vew_0l8WCM2xg8LQqj9PEzK/exec";

    // const baseWishUrl = "https://script.google.com/macros/s/AKfycbyHy9UrNxJ-pkDYRNvrVIPatQ1ElVXRdZX_ly-NuNCk12UfpyRYPnEQ5QQV8nDi2nS42g/exec";
    const baseWishUrl = "https://script.google.com/macros/s/AKfycbxdClzhPAkG27Zn8Z7tfV-89pYStYiR2NSMTKlPGeJccPZFUHwjMx6d7-dq8oq_9h4v/exec";

    const arrWish = [];
    const urlParams = new URLSearchParams(window.location.search);

    const id = urlParams.get("id");
    if (id) {
        $.get(baseInviteUrl, {id: id })
            .then(function(res) {
                $("#invitation-name").html(res.result.name);
                $(".invitation-code").val(res.result.code);
            });
    }

    initWishes();
        

    const form = document.getElementById("form-wish");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const data = new FormData(event.target);

        /**
         * with this you can perform some validation, etc
         **/
        const name = data.get("name");
        const address = data.get("address");
        const wish = data.get("wish");

        console.log(name, address, wish)
        if (!name || !address || !wish) {
            Swal.fire({
                icon: "warning",
                title: "Check your wish!",
                text: "Please check your wish!",
              });

              return false;
        }
        /**
         * send data to web APP URL from
         * script deployment
         *
         * change the url to your URL, don't use this
         **/
        fetch(baseWishUrl, {
            redirect: "follow", // don't remove this
            method: "POST",
            body: data,
        })
            .then(res => res.json())
            .then(data => {
                Swal.fire({
                    icon: "success",
                    title: "Submit Wish Success!",
                })
                
                initWishes();
            })
            .catch(err => console.log(err));
    });

    $("#open-invitation").click(function() {
        $("#open-invitation-wrapper").addClass("d-none");
        $("#slide").removeClass("close-invitation");
        $("#slide").addClass("open-invitation");
        $("#invitation-name").removeClass("d-none");
        $(".invitation-to").removeClass("d-none");

        $("audio").trigger('play');
    })
    

    function initWishes() {
        $.get(baseWishUrl)
        .then(function(res) {
            let counter = 0;
            let html = '';
            for(result of res.result) {
                if (counter == 0) {
                    counter ++;
                    continue;
                }

                html += `
                    <div class="wish-item text-center mb-3">
                        <p class="wish-text">${result[3]}</p>
                        <p class="wish-from">( ${result[1]} - ${result[2]} )</p>
                    </div>
                `;
                counter++;
            }

            $('.wish-wrapper').html(html);
            $('.wish-wrapper-modal').html(html);
        });
    }
});
