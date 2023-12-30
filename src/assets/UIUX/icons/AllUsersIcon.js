export const AllUserIcon = ({ color }) => {
  console.log(color)
  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill={"#FFF"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21 42C21 42 18 42 18 39C18 36 21 27 33 27C45 27 48 36 48 39C48 42 45 42 45 42H21ZM33 24C35.3869 24 37.6761 23.0518 39.364 21.364C41.0518 19.6761 42 17.3869 42 15C42 12.6131 41.0518 10.3239 39.364 8.63604C37.6761 6.94821 35.3869 6 33 6C30.6131 6 28.3239 6.94821 26.636 8.63604C24.9482 10.3239 24 12.6131 24 15C24 17.3869 24.9482 19.6761 26.636 21.364C28.3239 23.0518 30.6131 24 33 24V24Z"
          fill={color}
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M15.648 43.0013C15.2033 42.0647 14.9815 41.0379 15 40.0013C15 35.9363 17.04 31.7513 20.808 28.8413C18.9273 28.2618 16.9678 27.9784 15 28.0013C3 28.0013 0 37.0013 0 40.0013C0 43.0013 3 43.0013 3 43.0013H15.648Z"
          fill={color}
        />
        <path
          d="M13.5 25C15.4891 25 17.3968 24.2098 18.8033 22.8033C20.2098 21.3968 21 19.4891 21 17.5C21 15.5109 20.2098 13.6032 18.8033 12.1967C17.3968 10.7902 15.4891 10 13.5 10C11.5109 10 9.60322 10.7902 8.1967 12.1967C6.79018 13.6032 6 15.5109 6 17.5C6 19.4891 6.79018 21.3968 8.1967 22.8033C9.60322 24.2098 11.5109 25 13.5 25V25Z"
          fill={color}
        />
      </svg>
    </>
  );
};
