Incoming Request
Middleware ---> can modify req/res or stop request
Guards
Interceptors (before)
Pipes
Controller / Route Handler
Interceptors (after)
Response sent to client

#Class Validator

## Common Decorators

- `@IsString()` - Validates that a property is a string
- `@IsNumber()` - Validates that a property is a number
- `@IsInt()` - Validates that a property is an integer
- `@IsEmail()` - Validates that a property is an email
- `@IsNotEmpty()` - Validates that a property is not empty
- `@IsOptional()` - Marks a property as optional (skips validation if undefined)
- `@MinLength(min)` - Validates minimum string length
- `@MaxLength(max)` - Validates maximum string length
- `@Min(min)` - Validates minimum number value
- `@Max(max)` - Validates maximum number value
- `@IsBoolean()` - Validates that a property is a boolean
- `@IsArray()` - Validates that a property is an array
- `@IsDate()` - Validates that a property is a date
- `@IsEnum(enum)` - Validates that a property is a valid enum value
- `@IsUrl()` - Validates that a property is a valid URL
- `@Matches(pattern)` - Validates that a property matches a regex pattern
- `@ValidateNested()` - Validates nested objects (use with `@Type()` from class-transformer)

## JWT with factory

```
JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return {
          secret,
          signOptions: { expiresIn: '60s' },
        };
      },
    }),
```

# order of sql

Logical Execution Order

FROM

JOIN (if present)

WHERE

GROUP BY

HAVING

SELECT

DISTINCT (if used)

ORDER BY

LIMIT

OFFSET

# Aggregate data

```
 return this.productModel.aggregate([
      // Lookup stage: join with another collection/table (example: "otherCollection")
      {
        $lookup: {
          from: 'otherCollection', // Replace with the actual collection name you want to join with
          localField: 'name', // Local field in product documents
          foreignField: 'name', // Field in the other collection to match
          as: 'joinedData',
        },
      },

      // Match stage (filter)
      { $match: {} }, // Empty object matches all documents

      // Sort stage
      { $sort: { name: 1 } }, // 1 = ascending, -1 = descending

      // Group stage
      {
        $group: {
          _id: '$name',
          total: { $sum: 1 }, // Count number of products by name
          docs: { $push: '$$ROOT' },
          joined: { $push: '$joinedData' },
        },
      },

      // Limit stage
      { $limit: 10 },
    ]);

```

# Many to One

Ownership / Foreign Key Rules

@OneToOne – side with @JoinColumn() owns the foreign key.

@ManyToOne / @OneToMany – ManyToOne side owns the foreign key.

@ManyToMany – side with @JoinTable() owns the join table.

# elastic search
