import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import express from 'express';

// Construct a schema, using GraphQL schema language
const restaurants = [
    {
        id: 1,
        name: "WoodsHill ",
        description: "American cuisine, farm to table, with fresh produce every day",
        dishes: [
            {
                name: "Swordfish grill",
                price: 27,
            },
            {
                name: "Roasted Broccily ",
                price: 11,
            },
        ],
    },
    {
        id: 2,
        name: "Fiorellas",
        description: "Italian-American home cooked food with fresh pasta and sauces",
        dishes: [
            {
                name: "Flatbread",
                price: 14,
            },
            {
                name: "Carbonara",
                price: 18,
            },
            {
                name: "Spaghetti",
                price: 19,
            },
        ],
    },
    {
        id: 3,
        name: "Karma",
        description: "Malaysian-Chinese-Japanese fusion, with great bar and bartenders",
        dishes: [
            {
                name: "Dragon Roll",
                price: 12,
            },
            {
                name: "Pancake roll ",
                price: 11,
            },
            {
                name: "Cod cakes",
                price: 13,
            },
        ],
    },
];

const schema = buildSchema(`
    type Query {
        restaurant(id: Int): restaurant
        restaurants: [restaurant]
    }
    type restaurant {
        id: Int
        name: String
        description: String
        dishes: [Dish]
    }
    type Dish {
        name: String
        price: Int
    }
    input restaurantInput {
        name: String
        description: String
    }
    type DeleteResponse {
        ok: Boolean!
    }
    type Mutation {
        setrestaurant(input: restaurantInput): restaurant
        deleterestaurant(id: Int!): DeleteResponse
        editrestaurant(id: Int!, name: String!): restaurant
    }
`);

// The root provides a resolver function for each API endpoint
const root = {
  restaurant: ({ id }) => {
      return restaurants.find(restaurant => restaurant.id === id);
  },
  restaurants: () => {
      return restaurants;
  },
  setrestaurant: ({ input }) => {
      const newId = restaurants.length > 0 ? restaurants[restaurants.length - 1].id + 1 : 1;
      const newRestaurant = { id: newId, ...input, dishes: [] };
      restaurants.push(newRestaurant);
      return newRestaurant;
  },
  deleterestaurant: ({ id }) => {
      const index = restaurants.findIndex(restaurant => restaurant.id === id);
      if (index !== -1) {
          restaurants.splice(index, 1);
          return { ok: true };
      } else {
          return { ok: false };
      }
  },
  editrestaurant: ({ id, name }) => {
      const restaurant = restaurants.find(restaurant => restaurant.id === id);
      if (restaurant) {
          restaurant.name = name;
          return restaurant;
      } else {
          throw new Error('Restaurant not found');
      }
  },
};


const app = express();

app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);

const port = 5500;
app.listen(port, () => console.log('Running GraphQL on Port:' + port));

export default root;

