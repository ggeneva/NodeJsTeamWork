const ObjectId = require('mongodb').ObjectID;

class BaseData {
    constructor(db, ModelClass, validator) {
        this.db = db;
        this.ModelClass = ModelClass;
        this.validator = validator;
        this.collectionName = this._getCollectionName();
        this.collection = this.db.collection(this.collectionName);
    }

    getAll() {
        let result = this.collection
            .find()
            .toArray();

        if (this.ModelClass.toViewModel) {
            result = result.then((models) => {
                return models.map((model) =>
                    this.ModelClass.toViewModel(model));
            });
        }
        return result;
    }

    create(model) {
        if (!this._isModelValid(model)) {
            return Promise.reject('Invalid model');
        }
        return this.collection.insert(model)
            .then(() => {
                return this.ModelClass.toViewModel(model);
            });
    }

    getById(id) {
        // eslint-disable-next-line
        return this.collection.findOne({ _id: ObjectId(id) });
    }

    getByObjectName(objectName) {
        const dbObject = this.collection.findOne({
            name: objectName.toString(),
        });
        return dbObject;
    }

    _isModelValid(model) {
        return this.validator.isValid(model);
    }

    _getCollectionName() {
        return this.ModelClass.name.toLowerCase() + 's';
    }
}

module.exports = BaseData;