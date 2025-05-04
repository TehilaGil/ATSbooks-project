import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const myApi = createApi({
  reducerPath: 'myApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:7000/api/' }), // כתובת ה-API שלך
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => 'user', // נתיב הקריאה שלך, לדוגמה: /users
    }),
  }),
});

export const { useGetUsersQuery } = myApi;



