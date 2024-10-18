import axios from "axios";
import AdminLayout from "../../components/AdminLayout";
import { useEffect, useState } from "react";

function UserBoard() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        axios.get("/api/v1/users")
            .then(res => {
                console.log(res.data)
                setUsers(res.data)
            })
            .catch(err => console.log(err))
    }, [])

    return (
        <>
            <AdminLayout>
                <table>
                    <thead>
                        <tr>
                            <th>id</th>
                            <th>username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </AdminLayout>
        </>
    );
}

export default UserBoard;