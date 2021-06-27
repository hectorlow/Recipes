import React from 'react';
import PropTypes from 'prop-types';
import BootstrapTextField from 'components/form/BootstrapTextField';
import RecipeBookIcon from 'images/recipe-book.png';
import './FormTemplate.scss';

const FormTemplate = ({ title, formFields, SubmitButton, subtext }) => {
  const renderTextField = (label, value, handleChange) => (
    <div key={label}>
      <div className="FormTemplate__form-label">{label}</div>
      <BootstrapTextField
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        fullWidth
        type={label.toLowerCase() === 'password' ? 'password' : 'text'}
      />
    </div>
  );

  return (
    <div>
      <div className="FormTemplate__header">
        {title}
        <img src={RecipeBookIcon} alt="" className="FormTemplate__app-icon" />
      </div>
      <div className="FormTemplate__subtext">{subtext}</div>
      <form className="FormTemplate__form">
        {formFields.map((field) =>
          renderTextField(field.label, field.value, field.onChange)
        )}
        <div className="FormTemplate__submit-button">
          <SubmitButton />
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
  SubmitButton: PropTypes.func.isRequired,
  subtext: PropTypes.string,
};

FormTemplate.defaultProps = {
  subtext: null,
};

export default FormTemplate;
