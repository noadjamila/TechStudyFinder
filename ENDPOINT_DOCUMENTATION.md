# API Endpoint Documentation

## GET
| Endpoint | Description |
|----------|-------------|
| /home | Home Screen |
| /api/quiz/level/:levelId | Fetch questions for a specific quiz level |
| /api/quiz/results/:resultId | Show results for a specific quiz attempt |
| /api/users/favorites | Retrieve a user's favorite study programmes |
| /api/users/results | Retrieve a user's recent complete list of results |
| /api/auth/verify | Verify user authentication token |
| /api/studyprogrammes/:id | Fetch details of a specific study programme by ID |

## POST
| Endpoint | Description                                                   |
|---------|---------------------------------------------------------------|
| /api/auth/register | Register a new user                                           |
| /api/auth/login | User login                                                    |
| /api/auth/logout | User logout                                                   |
| /api/users/favorites | Add a study programme to a user's list of favorites           |
| /api/quiz/filter/progress | Filter quiz questions based on user progress after each level |
| /deploy/webhook | Webhook for deployment triggers                               |

## PUT
| Endpoint | Description |
|----------|-------------|
| tbd      | tbd         |

## DELETE
| Endpoint | Description                                   |
|----------|-----------------------------------------------|
| /api/users/favorites/:programmeId | Remove a study programme (by programmeId) from a user's list of favorites |
| /api/users/me | Delete the authenticated user's account       |
