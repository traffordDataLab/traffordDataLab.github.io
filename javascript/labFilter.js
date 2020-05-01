/*
    Created:        2019-12-09 by James Austin - Trafford Data Lab
    Updated:        2020-05-01 - improved accessibility
    Purpose:        To provide an easy method of filtering content on a web page
    Dependencies:   None
    Licence:        https://www.trafforddatalab.io/assets/LICENSE.txt
*/
function LabFilter(objOptions) {
    var context = this;

    // Function taking input from the filter UI and performing the filtering process
    this.doFilter = function () {
        try {
            var def_filterTerm = context.input.value.toLowerCase();    // convert the input to lowercase so we can match like-for-like with the content
            var numMatch = 0;   // a count of the total number of matches found

            // remove no results message if present
            if (context.searchItemsContainer.contains(context.elNoMatchesMsg)) context.searchItemsContainer.removeChild(context.elNoMatchesMsg);

            // remove all current items to search from their container
            for (var i = 0; i < context.arrElSearchItems.length; i++) {
                if (context.searchItemsContainer.contains(context.arrElSearchItems[i])) context.searchItemsContainer.removeChild(context.arrElSearchItems[i]);
            }

            // Loop through all elements containing the search terms, looking for matches of def_filterTerms
            for (var i = 0; i < context.arrSearchTerms.length; i++) {
                if (def_filterTerm == '' || context.arrSearchTerms[i].indexOf(def_filterTerm) > -1) {
                    // Either the filter has been cleared or a match has been found, so add the item to the container
                    context.searchItemsContainer.appendChild(context.arrElSearchItems[i]);

                    // increment the match count
                    numMatch++;
                }
            }

            // Report the result of the filter
            var resultMsg;

            if (numMatch == 0) {
                resultMsg = ' (no matches)';

                // No matches have been found so display message in item container so that it is not just empty
                context.searchItemsContainer.appendChild(context.elNoMatchesMsg);
            }
            else if (numMatch == context.arrElSearchItems.length) {
                resultMsg = ' (showing all ' + context.arrElSearchItems.length + ')';
            }
            else {
                resultMsg = ' (showing ' + numMatch + ' of ' + context.arrElSearchItems.length + ')';
            }

            context.elResultsFeedback.removeChild(context.elResultsFeedbackMsg);
            context.elResultsFeedbackMsg = document.createTextNode(resultMsg);
            context.elResultsFeedback.appendChild(context.elResultsFeedbackMsg);
        }
        catch (e) {
            // Some error has occurred preventing the filter from working. Alert the user and remove the UI
            alert('Sorry, an issue occurred with the filter facility.\nIt will now be removed, apologies for the inconvenience.');
            context.filterContainer.removeChild(context.form);
        }
    };

    try {
        // Get an array of all HTML elements containing the keywords or 'tags' we are going to search on. Looks for elements containing the .filterTags class by default
        this.arrElSearchTags = (objOptions['searchTags'] == null) ? document.getElementsByClassName('filterTags') : objOptions['searchTags'];

        // Get an array of the parent elements of the search keywords - these are effectively the elements we are going to show/hide when we do a search
        // We also need to create an array of the search keywords associated with each item as this.arrElSearchTags will be destroyed once we begin searching as the parent elements will be removed from the DOM
        this.arrElSearchItems = new Array();    // this will be an array of DOM elements
        this.arrSearchTerms = new Array();      // this will be an array of search terms, the index in the array corresponding to the item they belong to
        for (var i = 0; i < this.arrElSearchTags.length; i++) {
            this.arrElSearchItems.push(this.arrElSearchTags[i].parentNode);
            this.arrSearchTerms.push(this.arrElSearchTags[i].innerHTML.toLowerCase());
        }

        // The items to search on should be in some form of container, (e.g. div, section etc.) - we need to insert/remove the items in the DOM with reference to this
        this.searchItemsContainer = this.arrElSearchItems[0].parentNode;

        // Create a message to display if no results are found - this can be added and removed from searchItemsContainer as required
        var noMatchesMsg = (objOptions['noMatchesMsg'] == null) ? 'Sorry, no matches were found.' : String(objOptions['noMatchesMsg']);
        this.elNoMatchesMsg = document.createElement('p');
        this.elNoMatchesMsg.appendChild(document.createTextNode(noMatchesMsg));
        if (objOptions['noMatchesClass'] != null) this.elNoMatchesMsg.setAttribute('class', String(objOptions['noMatchesClass']));

        // User Interface properties
        this.filterContainer = (objOptions['filterContainer'] == null) ? null : objOptions['filterContainer'];  // The HTML object to create the user interface for the filter within
        this.filterClass = (objOptions['filterClass'] == null) ? null : String(objOptions['filterClass']);  // CSS class[es] to apply to the user interface
        this.filterPlaceholder = (objOptions['filterPlaceholder'] == null) ? 'enter keywords...' : String(objOptions['filterPlaceholder']); // text to display within the filter input box
        this.filterTitle = (objOptions['filterTitle'] == null) ? '' : String(objOptions['filterTitle']);  // An optional descriptive title to appear in a tooltip
        this.filterAriaLabel = (objOptions['filterAriaLabel'] == null) ? 'Begin typing to automatically filter the items on the page.' : String(objOptions['filterLabel']);  // Extra instructions read aloud by screen readers to assist users
        this.filterLabel = (objOptions['filterLabel'] == null) ? null : String(objOptions['filterLabel']);  // An optional label to associate with the input box to further make the form more accessible

        // Create the form element to contain the filter
        this.form = document.createElement('form');
        this.form.id = 'frmFilter';
        this.form.name = 'frmFilter';
        this.form.method = 'get';
        this.form.action = '';
        this.form.setAttribute('onSubmit', 'return false;');
        this.form.addEventListener('submit', this.doFilter);

        // Create the input box to enter the filter terms
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.id = 'filterTerm';
        this.input.name = 'filterTerm';
        this.input.addEventListener('input', this.doFilter);
        if (this.filterPlaceholder !== '') this.input.placeholder = this.filterPlaceholder;
        if (this.filterTitle !== '') this.input.title = this.filterTitle;
        if (this.filterAriaLabel !== '') this.input.setAttribute('aria-label', this.filterAriaLabel);
        if (this.filterClass !== null) this.input.setAttribute('class', this.filterClass);

        // Create the label associated with the input box if text has been provided and add it to the form
        if (this.filterLabel !== null) {
            this.label = document.createElement('label');
            this.label.setAttribute('for', this.input.id);
            this.label.appendChild(document.createTextNode(this.filterLabel));
            this.form.appendChild(this.label);
        }

        // Feedback status message on the number of items currently being shown
        this.elResultsFeedback = document.createElement('span');
        this.elResultsFeedback.setAttribute('role', 'status');      // required for screen readers to know the contents are dynamic
        this.elResultsFeedback.setAttribute('aria-live', 'polite'); // for maximum compatability with the above, and to ensure the updates don't interrupt the user
        this.elResultsFeedbackMsg = document.createTextNode(' (showing all ' + this.arrElSearchItems.length + ').');
        this.elResultsFeedback.appendChild(this.elResultsFeedbackMsg);

        // Display the User Interface
        this.form.appendChild(this.input);              // add the filter input box to the form
        this.form.appendChild(this.elResultsFeedback);  // add the feedback message
        this.filterContainer.appendChild(this.form);    // add the completed form to the HTML element provided to the function
    }
    catch(e) {
        // Attempt to write out the error to the console if possible and don't do anything further - the functionality of the filter is not critical to the page
        if (window.console && window.console.log) {
            window.console.log('Error in labFilter.js - see below for details:');
            window.console.log(e);
        }
    }
}
