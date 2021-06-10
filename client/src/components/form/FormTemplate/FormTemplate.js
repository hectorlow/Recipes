import React from 'react';
import PropTypes from 'prop-types';
import BootstrapTextField from 'components/form/BootstrapTextField';
import SubmitButton from 'components/form/SubmitButton';
import './FormTemplate.scss';

const FormTemplate = ({
  title,
  formFields,
  onFormSubmit,
  submitButtonText,
}) => {
  const renderTextField = (label, value, handleChange) => (
    <div key={label}>
      <div className="FormTemplate__form-label">{label}</div>
      <BootstrapTextField
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        fullWidth
      />
    </div>
  );

  return (
    <div>
      <div className="FormTemplate__header">{title}</div>
      <form className="FormTemplate__form">
        {formFields.map((field) =>
          renderTextField(field.label, field.value, field.onChange)
        )}
        <div className="FormTemplate__submit-button">
          <SubmitButton label={submitButtonText} onClick={onFormSubmit} />
        </div>
      </form>
    </div>
  );
};

FormTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  formFields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      onChange: PropTypes.func,
    })
  ).isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
};

export default FormTemplate;
