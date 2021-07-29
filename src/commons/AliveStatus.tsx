/**
 * I am skipping testsing for this component as it is a stateless and UI component
 * 
 * This component shows the Character life status
 * Alive | Dead | unknown
 * @param props 
 */
const AliveStatus = (props: { status: string }) => {
    let color = 'gray';
    switch (props.status) {
        case 'Alive':
            color = 'green';
            break;
        case 'Dead':
            color = 'red';
            break;
    }

    return (
        <div
            title={props.status}
            style={{
                width: 14,
                height: 14,
                display: 'inline-block',
                borderRadius: '50%',
                backgroundColor: color
            }}></div>
    );
}
export default AliveStatus;