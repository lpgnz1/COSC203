// props is how we pass data to components
function Card(props) {

    // this component just returns an <img />
    return (
        <img className='card' src={props.card.img} alt='' />
    );
}
export default Card