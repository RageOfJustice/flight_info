import React from "react";
import "./style";
import {Link} from "react-router-dom";


class Info extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return(
			<section className="Info">
				<h3 className="Info__header">Информациия о приложении</h3>
				<div className="Info__body">
					<p>Данное приложение получает информацию о самолетах при помощи OpenSky API и отображает результат <Link to="/map" >на карте</Link> или по самолёту <Link to="/plane">с заданным номером ICAO24</Link></p>
					<p><strong>Автор:</strong> Вовк Никоалай, Кубанский Государственный университет, Факультет Прикладной Математики и Компьютерных Технологий</p>
					<p><strong>Используемые API:</strong> <ul>
						<li><a href="https://developers.google.com/maps/">GoogleMapsApi</a> </li>
						<li><a href="https://opensky-network.org/apidoc/rest.html">OpenSky REST API</a></li>
					</ul></p>
				</div>
			</section>
		)
	}
}

export default Info;