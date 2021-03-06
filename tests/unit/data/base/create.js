const { expect } = require('chai');
const sinon = require('sinon');

const BaseData = require('../../../../data/base/base.data');
const db = {
    collection: () => { },
};
let items = [];

let ModelClass = null;
let validator = null;
let data = null;
const model = null;

const insert = (something) => {
    return Promise.resolve(something);
};
describe('create(model)', () => {
    beforeEach(() => {
        items = [1, 2, 3, 4];
        sinon.stub(db, 'collection')
            .callsFake(() => {
                return { insert };
            });
        ModelClass = class {
        };
        ModelClass.toViewModel = (providedModel) => {
            return providedModel;
        };
        validator = {
            isValid: () => { },
        };

        // Arrange
        data = new BaseData(db, ModelClass, validator);
    });
    afterEach(() => {
        db.collection.restore();
        validator.isValid.restore();
    });

    it('expect to reject when invalid', () => {
        sinon.stub(validator, 'isValid')
            .callsFake(() => {
                return false;
            });
        return data.create(model)
            .then(() => {
                expect(false).to.be.true;
            },
            () => {
                expect(true).to.be.true;
            });
    });
    it('expect to add correctly when valid', () => {
        sinon.stub(validator, 'isValid')
            .callsFake(() => {
                return true;
            });
        return data.create(items)
            .then((result) => {
                expect(result).to.deep.equal(items);
            });
    });
});
