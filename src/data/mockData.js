const mockData = {
  users: [
    {
      id: 1,
      username: 'john_doe',
      email: 'john@example.com',
      progress: {
        daysSmokeFree: 30,
        moneySaved: 150,
        badges: ['1-day smoke free', '30-days smoke free'],
      },
      plans: [
        {
          id: 1,
          name: 'Quit Smoking Plan',
          stages: [
            {
              stage: 1,
              goal: 'Reduce smoking to 5 cigarettes a day',
              startDate: '2023-01-01',
              endDate: '2023-01-15',
            },
            {
              stage: 2,
              goal: 'Quit smoking completely',
              startDate: '2023-01-16',
              endDate: '2023-01-31',
            },
          ],
        },
      ],
    },
  ],
  blogs: [
    {
      id: 1,
      title: 'How to Quit Smoking',
      content: 'Quitting smoking is a journey that requires determination...',
      author: 'Jane Smith',
      date: '2023-01-01',
    },
    {
      id: 2,
      title: 'Benefits of Quitting Smoking',
      content: 'Quitting smoking can lead to numerous health benefits...',
      author: 'John Doe',
      date: '2023-01-15',
    },
  ],
  notifications: [
    {
      id: 1,
      message: 'Keep going! You are doing great!',
      date: '2023-01-01',
    },
    {
      id: 2,
      message: 'Remember why you started. Stay strong!',
      date: '2023-01-02',
    },
  ],
};

export default mockData;