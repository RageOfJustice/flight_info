import React from "react";
import PropTypes from "prop-types";
import "./style";
import VariantName from "../../constants/filterElementNames";
import {Set} from "immutable";


class Filter extends React.Component{
	constructor(props){
		super(props);

	}

	__handleSubmit(){

	}

	render(){

		const {filter} = this.props;
		return(

				<section className="Filter">
					{filter.getIn(["filterVariants","byCountry"]).size ? <FilterElement filterKeys={filter.get("filterKeys",null)} handleSubmit={this.props.filterByCountry} filterVariant={filter.getIn(["filterVariants","byCountry"])} filterVariantName={VariantName["byCountry"]} /> : null}
					<div className="Filter__footer">
						{/*<button type="submit" className="Filter__submit">Отправить</button>*/}
					</div>
				</section>

		);
	}




}

Filter.propTypes = {
	filter: PropTypes.object.isRequired,
	filterByCountry: PropTypes.func.isRequired,
	filterBySpi: PropTypes.func.isRequired,
	viewType: PropTypes.oneOf(["columns", "slider"])
};

class FilterElement extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			result: new Set(),
		};
		this.__handleCheck = this.__handleCheck.bind(this);
		this.__handleSubmit = this.__handleSubmit.bind(this);
		this.__handleReset = this.__handleReset.bind(this);
	}

	__handleCheck(event){
	    const value = event.target.value;
		if(event.target.checked){
			this.setState(oldState => ({
				result: oldState.result.add(value)
			}));
		} else {
			this.setState(oldState => ({
				result: oldState.result.delete(value)
			}));
		}
	}

	__handleReset(){
		this.setState(oldState => ({
			result: oldState.result.clear()
		}));
	}

	__handleSubmit(event){
        event.preventDefault();
        this.props.handleSubmit(this.state.result.toArray());
	}

	render(){
		const variant = this.props.filterVariant.toArray();
		return (
			<form onSubmit={this.__handleSubmit} className="FilterElement">
				<h5 className="FilterElement__header">{this.props.filterVariantName}</h5>
				<div className="FilterElement__body _columns">
					{variant.map((val, key) => (<div key={key} className="FilterElement__group"><label className="FilterElement__label"><input onChange={this.__handleCheck} defaultChecked={this.props.filterKeys && this.props.filterKeys.has(val)} type="checkbox" value={val} />{val}</label></div>))}
				</div>
                <div className="FilterElement__footer">
					<button onClick={this.__handleReset} type="reset" className="FilterElement__reset">Сбросить</button>
                    <button type="submit" className="FilterElement__submit">Отправить</button>
                </div>
			</form>
		);
	}


}

FilterElement.propTypes = {
	handleSubmit: PropTypes.func.isRequired,
	filterVariant: PropTypes.object.isRequired,
	filterVariantName: PropTypes.string.isRequired,
	filterKeys: PropTypes.object
};


export default Filter;