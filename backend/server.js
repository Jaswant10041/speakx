const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const mongoose = require('mongoose');
require('dotenv').config();
const { QuizModel } = require('./models/DataModel'); 

const PROTO_PATH = './first.proto';
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const quizProto = grpc.loadPackageDefinition(packageDefinition).quiz;

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error connecting to MongoDB:', err));

const searchQuery = async (call, callback) => {
    const query = call.request.query;
    try {
        const questions = await QuizModel.find({
            title: { $regex: query, $options: 'i' }
        }).select('title type _id');

        const searchResponse = {
            questions: questions.map(q => ({
                id: q._id.toString(),
                type: q.type,
                title: q.title
            }))
        };

        callback(null, searchResponse);
    } catch (err) {
        console.error('Error during search:', err);
        callback({
            code: grpc.status.INTERNAL,
            details: 'Internal error occurred'
        });
    }
};

function startServer() {
    const server = new grpc.Server();
    server.addService(quizProto.QueryService.service, { searchQuery });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log('gRPC server running at http://localhost:50051');
        server.start();
    });
}

startServer();
