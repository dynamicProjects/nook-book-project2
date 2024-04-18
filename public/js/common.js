
  $(document).ready(function() {
    // Function to open sign-in modal
    function openSignInModal() {
        $.ajax({
            url: "../html-components/signIn.html", 
            success: function(data) {
                $('#modalContainer').html(data);
                $('#modalContainer').show();
                $("#signInModal").fadeIn();
            }
        });
    }
    // Function to play navbar button animation on click when collapsed
    function playAnimation() {
      var expanded = $("#nav-collapsed-button").attr("aria-expanded");
      if (expanded === "false") {
        $('.bar').css("background-color", "#ff9300");
        $('.bar-1').width("100%");
        $('.bar-3').width("100%");
      } else {
        $('.bar').css("background-color", "#FFFFFF");
        $('.bar-1').width("80%");
        $('.bar-3').width("50%");
      }
    }
    // Event listener for sign-in button click
    $('#openSignInModalBtn').click(openSignInModal);
    // Event listener for navbar collapsed button click
    $('#nav-collapsed-button').click(playAnimation);
});