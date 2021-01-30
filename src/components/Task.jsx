import ProgressBar from 'react-bootstrap/ProgressBar'




function Task(props) {
    
    var taskStyle = {
        display:"inline-block"
    }

    taskStyle.width = props.estimationSize;

    return (
        <>
        <div style={ taskStyle }>
            <p>{ props.name != null ? props.name : "Untitled" }</p>
            <ProgressBar now={props.progress} />
        </div>
        </>
    );
}

export default Task;