

const UserPage = ({params}:{params:{userID: number}}) => {
    return <div>User ID: {params.userID}</div>;
};

export default UserPage;
