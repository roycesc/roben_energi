// When a tab is clicked, add the 'active' class to it and the corresponding card
$('.tab-radio').change(function() {
    // Hide all tabs
    $('.card-slider').removeClass('active');
    // Show the selected tab
    $('#card-slider-' + $(this).attr('id').substr(3)).addClass('active');

    // Remove active class from all labels
    $('.tab-label').removeClass('active');
    // Add active class to the corresponding label
    $('label[for="' + $(this).attr('id') + '"]').addClass('active');

    // Update the indicator position
    var index = $('.tab-radio').index(this);
    if (window.innerWidth <= 600) {
        // For small screens, move the indicator vertically
        var topPosition = $('label[for="' + $(this).attr('id') + '"]').position().top;
        document.querySelector('.indicator').style.top = `${topPosition}px`;
    } else {
        // For larger screens, move the indicator horizontally
        document.querySelector('.indicator').style.left = `${index * 33.333}%`;
    }

    // Save active tab
    localStorage.setItem('activeTab', $(this).attr('id'));


      
});

// On page load, activate the tab that was last active, or the first tab if none were active
$(document).ready(function() {
    var activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        $('#' + activeTab).prop('checked', true).change();
    } else {
        $('.tab-radio:first').prop('checked', true).change();
    }
});

// Hide all tabs initially
$('.card-slider').css('display', 'none');

// Show the tabs after the page has loaded
$(window).on('load', function() {
    $('.card-slider').css('display', '');
});

// Save the input values in the local storage when they change
document.querySelectorAll('.input-field').forEach(function(input) {
    input.addEventListener('change', function() {
        localStorage.setItem(input.id, input.value);
    });

    // On page load, restore the input values from the local storage
    var savedValue = localStorage.getItem(input.id);
    if (savedValue) {
        input.value = savedValue;
    }
});

$(document).ready(function(){
  function toggleDropdowns(idPrefix, isChecked) {
      if (isChecked) {
          $("#" + "startTime-" + idPrefix + "-container").addClass("hide");
      } else {
          $("#" + "startTime-" + idPrefix + "-container").removeClass("hide");
      }
  }

  // initial setup
  toggleDropdowns("wash", $("#wash-best").is(":checked"));
  toggleDropdowns("dish", $("#dish-best").is(":checked"));
  toggleDropdowns("car", $("#car-best").is(":checked"));

  $("#wash-best").change(function(){
      toggleDropdowns("wash", $(this).is(":checked"));
  });

  $("#dish-best").change(function(){
      toggleDropdowns("dish", $(this).is(":checked"));
  });

  $("#car-best").change(function(){
      toggleDropdowns("car", $(this).is(":checked"));
  });
});

// Add event listener for each checkbox
document.querySelectorAll('input[type="checkbox"]').forEach(function(checkbox) {
  checkbox.addEventListener('change', function() {
      // Get the corresponding start time container
      var startTimeContainer = document.querySelector('#startTime-' + checkbox.id.split('-')[0] + '-container');
      if (checkbox.checked) {
          startTimeContainer.style.maxHeight = '0';
          startTimeContainer.style.opacity = '0';
      } else {
          startTimeContainer.style.maxHeight = '1000px';  /* Change this value according to your need */
          startTimeContainer.style.opacity = '1';
      }
  });
});
