!(function () {
// Contact-us form selectors
const mainView = document.querySelector('.inner-view.uf-contact-experience');

const mainViewWrapper = mainView?.parentElement;

const form = mainView?.querySelector('form.formless');

const formUl = form?.querySelector('.uf-input-fields');

const inputFields = formUl?.querySelectorAll('.uf-input-fields li');

const commentsTextArea = formUl?.querySelector('[name="comments"]');

const comments = commentsTextArea?.parentElement;

const iWouldLikeTo = formUl?.querySelector('[name="Iwouldliketo"]').parentElement;

const iAmInterestedIn = formUl?.querySelector('[name="iAmInterestedIn"]').parentElement;

const countryField = formUl?.querySelector('[name="country"]');

const stateField = formUl?.querySelector('[name="state"]');

const globalRequiredMessage = document.createElement('span');

const submitButtonWrapper = formUl?.querySelector('div.UF-submit-btn');

const logInLink = mainView?.querySelector('.UF-sign-in-account');

const logInLinkParent = logInLink?.parentNode;

const requiredFieldList = [
    'email',
    'Iwouldliketo',
    'iAmInterestedIn',
    'firstname',
    'lastname',
    'company',
    'businessPhone',
    'jobLevel',
    'country',
    'mobilePhone',
    'password'];

const optionalFieldList = ['comments'];

const dependentRequiredFieldList = ['jobRole', 'jobFunction', 'state'];

const autoCorrectOffList = ['firstname', 'lastname', 'company'];

const capitalizeList = ['firstname', 'lastname'];



// global functions

/**
 * markErrorState
 * this method is used to add idetification attribute(data-required-error) to elements
 * where data is not entered for required fields
 * @param {HTMLElement} element 
 * @param {Boolean} required 
 */
function markErrorState(element, required) {
    required ? element?.setAttribute('data-required-error', 'true') : element?.removeAttribute('data-required-error');
    toggleGlobalRequiredErrorMessage(!!formUl?.querySelector('[data-required-error]'));
}

/**
 * addRequiredAsteriskToSpan
 * this method is used to add asterisk(*) to span elements,
 * where attribute name is matching form the list
 * @param {Array} list 
 */
function addRequiredAsteriskToSpan(list) {
    list.forEach((fieldName) => {
        let spanField = formUl.querySelector(`[name=${fieldName}]~span`);
        if (!spanField?.textContent?.includes('*')) {
            spanField.textContent = spanField?.textContent + ' * ';
        }
    });
}

/**
 * addRequiredAsteriskToSpan
 * this method is used to add asterisk(*) to innerHTML of option,
 * where attribute name is matching form the list
 * @param {Array} list 
 */
function addRequiredAsteriskToOption(list) {
    list.forEach((fieldName) => {
        let optionField = formUl.querySelector(`[name=${fieldName}] > option`);
        if (!optionField?.innerHTML.includes('*') && optionField?.innerHTML?.toLocaleLowerCase() !== 'other') {
            optionField.innerHTML = optionField?.innerHTML + ' * ';
        }
    });
}

/**
 * addOptionalLabelToSpan
 * this method is used to add (Optional) to span elements,
 * where attribute name is matching form the list
 * @param {Array} list 
 */
function addOptionalLabelToSpan(list) {
    list.forEach((fieldName) => {
        let spanField = formUl.querySelector(`[name=${fieldName}]~span`);
        if (!spanField?.textContent?.includes('Optional')) {
            spanField.textContent = spanField?.textContent + ' (Optional) ';
        }
    });
}

/**
 * toggleGlobalRequiredErrorMessage
 * This method is used to change style of globalRequiredMessage
 * @param {boolean} isRequiredErrorPresent 
 */

function toggleGlobalRequiredErrorMessage(isRequiredErrorPresent) {
    if (isRequiredErrorPresent) {
        globalRequiredMessage.classList.add('UF_validation_message');
        globalRequiredMessage.classList.add('UF_invalid');
    }
    else {
        globalRequiredMessage.classList.remove('UF_validation_message');
        globalRequiredMessage.classList.remove('UF_invalid');
    }
}


/**
 * capitalizeFieldData
 * This method is used to capitalize elememt value
 * where attribute name is matching form the list
 * @param {Array} list 
 */
function capitalizeFieldData(list) {
    list?.forEach((fieldName) => {
        if (formUl.querySelector(`[name=${fieldName}]`)) {
            formUl.querySelector(`[name=${fieldName}]`).style.textTransform = 'capitalize';
        }
    });
}

/**
 * disableAutoCorrect
 * this method is used to disable auto correct
 * where attribute name is matching form the list
 * @param {Array} list 
 */
function disableAutoCorrect(list) {
    list?.forEach((fieldName) => {
        formUl.querySelector(`[name=${fieldName}]`)?.setAttribute('autocorrect', 'off');
    });
}

/**
 * initMobileSpecificBehaviour
 */
function initMobileSpecificBehaviour() {
    formUl?.querySelector('[name="businessPhone"]')?.setAttribute('type', 'number');
}

/**
 * toggleStateDropdown
 * show state field on condition (only visible for country - US, India, China, Australia, Canada, Brazil)
 * state field initial value is '' where state selection is needed ( for country - US, India, China, Australia, Canada, Brazil)
 * state field initial value is 'other' where state selection is not needed
 * add asterisk(*) to state field on country selection when state field is shown/applicable
 */
function toggleStateDropdown() {
    if (stateField?.value?.toLocaleLowerCase() === 'other') {
        stateField?.parentElement?.classList.add('d-none');
        stateField?.value?.toLowerCase();
    }
    else {
        stateField?.parentElement?.classList.remove('d-none');
    }

    if (stateField.value.toLocaleLowerCase() === '') {
        addRequiredAsteriskToSpan(['state']);
    }
}

/**
* contactFormObserver
* Mutation observer method for listening mutation and check for '.UF-border-error' class
* if present call showGlobalRequiredMessageError with true
* else call showGlobalRequiredMessageError with false
*/
const contactFormObserver = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.type === 'childList') {
            const target = mutation.target;
            if (target.nodeName === 'LI' || target.nodeName === 'P') {

                const spanElement = target.querySelector('span.UF_invalid');
                spanElement && spanElement.textContent?.toLocaleLowerCase().includes('required') ? markErrorState(spanElement, true) : markErrorState(spanElement, false);
            } else if (target.nodeName === 'SPAN' && target.classList.contains('UF_invalid') && target.classList.contains('UF_validation_message')) {
                target && target.textContent?.toLocaleLowerCase().includes('required') ? markErrorState(target, true) : markErrorState(target, false);
            }
        }
    });
});

// To show single step form
inputFields?.forEach(element => {
    if (!element.classList.contains('UF-continue-btn')) {
        element.classList.remove('UF-ce-hide-input');
    }
    else {
        element.classList.add('UF-ce-hide-input');
    }
});

// add global(form-level) required/hint message 
globalRequiredMessage.innerText = 'Form fields with an asterisk (*) are required.';
globalRequiredMessage.classList.add('global-required-message');
if (submitButtonWrapper) {
    submitButtonWrapper.classList.add('mb-3');
    globalRequiredMessage && formUl?.after(submitButtonWrapper, globalRequiredMessage);
}

// change form field sequence
if (comments) {
    iWouldLikeTo && formUl?.insertBefore(iWouldLikeTo, comments);
    iAmInterestedIn && formUl?.insertBefore(iAmInterestedIn, comments);
}

// To remove h1(title) and other extra items to align based on new styles
document.querySelectorAll('div.title-component-inner-wrapper')[0]?.classList.add('d-none');
document.querySelectorAll('.UF-container .UF-container-50.right-side, .UF-container .UF-container-50.left-side').forEach((element) => {
    element.style.paddingTop = '40px';
});

mainViewWrapper?.querySelector('.inner-content-wrapper')?.classList.add('d-none');
mainViewWrapper?.querySelector('.additional-bottom-section')?.classList.add('d-none');

// change log in text copy and remove additonal copy text
if (logInLink && logInLinkParent) {
    logInLinkParent.innerText = '';
    logInLinkParent?.appendChild(logInLink);
    logInLinkParent?.insertAdjacentHTML('afterbegin', 'Complete this form, or ');
    logInLinkParent?.insertAdjacentHTML('beforeend', ' to your account, to connect with an expert.');
    logInLink.textContent = 'log in';
}
if (logInLinkParent.previousElementSibling) {
    logInLinkParent.previousElementSibling.style.display = 'none';
}

// reduce height of Additional comments section to 98px
commentsTextArea.style.height = '98px';

// change state,country fields styles based on updated design and behaviour
countryField?.parentElement?.classList.remove('UF-right-padding-8px');
countryField?.parentElement?.classList.add('w-100');
stateField?.parentElement?.classList.add('w-100');

// add asterisk(*) to all required fields on page load

addRequiredAsteriskToSpan(requiredFieldList);

addRequiredAsteriskToOption(dependentRequiredFieldList);

// add (Optional) to all optional fields on page load

addOptionalLabelToSpan(optionalFieldList);

//capitalize firstname and last name
capitalizeFieldData(capitalizeList);

// disable auto correct for specified fields
disableAutoCorrect(autoCorrectOffList);

//mobile specific feature
initMobileSpecificBehaviour();

// add asterisk(*) to required fields which changes in DOM dynamically based on other selection
formUl?.querySelector('[name="jobLevel"]')?.addEventListener('change', function () {
    addRequiredAsteriskToSpan(['jobRole', 'jobFunction']);
    addRequiredAsteriskToOption(['jobFunction']);

    formUl.querySelector('[name="jobRole"]')?.addEventListener('change', function () {
        addRequiredAsteriskToSpan(['jobFunction']);
    });
});

//show state field on condition (only visible for country - US, India, China, Australia, Canada, Brazil)
stateField?.parentElement?.classList.add('d-none');
countryField?.addEventListener('change', toggleStateDropdown);


// Starts listening for changes in the contact-us form
contactFormObserver.observe(formUl, {
    attributes: true,
    childList: true,
    subtree: true,
    attributeOldValue: true,
});
})()