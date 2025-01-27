const mongoose=require('mongoose');
const quizSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['ANAGRAM', 'MCQ', 'READ_ALONG', 'CONTENT_ONLY', 'CONVERSATION']
    },
    anagramType: {
        type: String,
        required: function () { return this.type === 'ANAGRAM'; }
    },
    blocks: [{
        text: String,
        showInOption: Boolean,
        isAnswer: Boolean
    }],
    options: [{
        text: String,
        isCorrectAnswer: Boolean
    }],
    siblingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'questionDetails'
    },
    solution: {
        type: String,
        required: function () { return this.type === 'ANAGRAM'; }
    },
    title: {
        type: String,
        required: true
    }
});

quizSchema.pre('validate', function (next) {
    if (this.type === 'ANAGRAM' && (!this.blocks || this.blocks.length === 0)) {
        return next(new Error('Blocks are required for ANAGRAM type questions.'));
    }
    if (this.type === 'MCQ' && (!this.options || this.options.length === 0)) {
        return next(new Error('Options are required for MCQ type questions.'));
    }
    next();
});

const QuizModel = mongoose.model('questiondetails', quizSchema);
module.exports={QuizModel};