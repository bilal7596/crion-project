export const CreateAsset = ({color}) => {
  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_42_110)">
          <path
            d="M0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0L42 0C43.5913 0 45.1174 0.632141 46.2426 1.75736C47.3679 2.88258 48 4.4087 48 6H0ZM0 9V42C0 43.5913 0.632141 45.1174 1.75736 46.2426C2.88258 47.3679 4.4087 48 6 48H42C43.5913 48 45.1174 47.3679 46.2426 46.2426C47.3679 45.1174 48 43.5913 48 42V9H0Z"
            fill={color}
          />
        </g>
        <defs>
          <clipPath id="clip0_42_110">
            <rect width="48" height="48" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </>
  );
};
