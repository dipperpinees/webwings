export interface IOAuth {
    'id': (string);
    'userId': string;
    'gitUserId': (number);
    'username': (string);
    'url': (string);
    'oauthType': (string);
    'email'?: (string);
    'name'?: (string);
    'avatarUrl'?: (string);
    'createdAt': Date;
    'updatedAt': Date;
}