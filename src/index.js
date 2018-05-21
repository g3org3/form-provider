import React from "react";
import PropTypes from "react-proptypes";

const FormContext = React.createContext({});
const isChecked = type => type === "checkbox" || type === "radio";

export default class FormProvider extends React.PureComponent {
  static propTypes = {
    onSubmit: PropTypes.func,
    values: PropTypes.object,
    disableAutoSubmit: PropTypes.bool,
    formProps: PropTypes.object
  }
  static defaultProps = {
    onSubmit: () => console.log("FormProvider.props.onSubmit"),
    values: {}
  };
  static Consumer = FormContext.Consumer;
  static Input = ({ name, ...rest } = {}) => (
    <FormContext.Consumer>
      {({ onChange, ...props }) => {
        const newProps = {
          ...rest,
          name,
          onChange,
          value: isChecked(rest.type) ? name : props[name],
          checked: isChecked(rest.type) ? props[name] : undefined
        };
        return <input {...newProps} />;
      }}
    </FormContext.Consumer>
  );
  static Submit = ({ value = "submit", type = "submit", ...rest } = {}) => (
    <button {...rest} type={type}>
      {value}
    </button>
  );
  constructor(props) {
    super(props);
    this.updateField = this.updateField.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      ...this.props.values
    };
  }
  getProps() {
    return {
      ...this.state,
      onChange: this.updateField,
      submit: this.submit
    };
  }

  isItemInObj(item = '', obj = {}) {
    return Object.keys(obj).indexOf(item) !== -1;
  }

  updateField({ target } = {}) {
    const { value, name, type, checked } = target;
    if (this.isItemInObj(name, this.props.values)) {
      this.setState(s => ({
        ...s,
        [name]: isChecked(type) ? checked : value
      }));
    }
  }

  onSubmit(e = {}) {
    e.preventDefault();
    if (this.props.disableAutoSubmit) return false;

    this.props.onSubmit(this.state);
    return false;
  }

  submit(e = {}) {
    e.preventDefault();
    this.props.onSubmit(this.state);
  }

  render() {
    return (
      <FormContext.Provider value={this.getProps()}>
        <form {...this.props.formProps} onSubmit={this.onSubmit}>
          <FormContext.Consumer>{this.props.children}</FormContext.Consumer>
        </form>
      </FormContext.Provider>
    );
  }
}
