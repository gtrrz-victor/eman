export interface Query {
    $metadata: Metadata;
    Count: number;
    Items?: People[];
    ScannedCount: number;
}

export interface Metadata {
    httpStatusCode: number;
    requestId: string;
    attempts: number;
    totalRetryDelay: number;
}

export interface People {
    phoneNumber: StringType;
    id: StringType;
    name: StringType;
    isAssisting?: BooleanType;
    more?: NumberType;
    address?: StringType;
    additionalPeople?: NumberType;
    notifications?: ArrayType<NotificationType>;
}

export interface NotificationType {
    M: {
        topic: StringType;
        datetime: StringType
    }
}

export interface NumberType {
    N: string;
}

export interface StringType {
    S: string;
}

export interface BooleanType {
    BOOL: boolean;
}

export interface ArrayType<T> {
    L: T[]
}