import styles from './userList.module.css';

export function UserList(props) {
    return (
        <div className={styles.active_users_panel}>
            <h3>Active Users:</h3>
            <ul>
                {
                    props.list.map((item, idx) => (
                        <li key={idx} onClick={() => props.handleClick(item)}>{item}</li>
                    ))
                }
            </ul>
        </div>
    )
}