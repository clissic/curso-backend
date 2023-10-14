import { ProductsMongoose } from '../DAO/models/mongoose/products.mongoose.js';
import { productsService } from '../services/products.service.js';
import { logger } from '../utils/logger.js';
import ProductDTO from './DTO/products.dto.js';

class ProductsController {
  async getAll(req, res) {
    try {
      const allProducts = await productsService.getAll();
      return res.status(200).json({
        status: 'success',
        message: 'Products found',
        payload: allProducts,
      });
    } catch (error) {
      logger.error('Error finding products in products.controller: ' + error);
      return res.status(500).render('errorPage', {
        msg: 'Error finding product.',
      });
    }
  }

  async create(req, res) {
    try {
      const { thumbnail, title, price, description, code, category, stock, status, owner } = req.body;
      const productDTO = new ProductDTO(title, description, price, thumbnail, code, stock, category, status, owner);
      const newProduct = await productsService.create(
        productDTO.title,
        productDTO.description,
        productDTO.price,
        productDTO.thumbnail,
        productDTO.code,
        productDTO.stock,
        productDTO.category,
        productDTO.status,
        productDTO.owner
      );
      return res.status(201).json({
        status: 'success',
        message: 'Product created',
        payload: newProduct,
      });
    } catch (error) {
      logger.error('Error creating product in products.controller: ' + error);
      return res.status(500).render('errorPage', {
        msg: 'Error creating product.',
      });
    }
  }

  async getAllAndPaginate(req, res) {
    try {
      const { currentPage, prodLimit, sort, query } = req.query;
      const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
      const filter = {};
      if (query === 'tablet' || query === 'celphone' || query === 'notebook') {
        filter.category = query;
      }
      if (query === 'available') {
        filter.stock = { $gt: 0 };
      }

      const queryResult = await ProductsMongoose.paginate(filter, {
        sort: sortOption,
        limit: prodLimit || 10,
        page: currentPage || 1,
      });
      let paginatedProd = queryResult.docs;
      const { totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage } = queryResult;
      paginatedProd = paginatedProd.map((prod) => ({
        _id: prod._id.toString(),
        title: prod.title,
        description: prod.description,
        price: prod.price,
        thumbnail: prod.thumbnail,
        code: prod.code,
        stock: prod.stock,
        category: prod.category,
      }));
      const prevLink = hasPrevPage ? `/api/products?currentPage=${queryResult.prevPage}&prodLimit=${prodLimit ? prodLimit : ''}&sort=${sort ? sort : ''}&query=${query ? query : ''}` : null;
      const nextLink = hasNextPage ? `/api/products?currentPage=${queryResult.nextPage}&prodLimit=${prodLimit ? prodLimit : ''}&sort=${sort ? sort : ''}&query=${query ? query : ''}` : null;
      return res.status(200).json({
        status: 'success',
        msg: 'Products list',
        payload: {
          paginatedProd,
          totalDocs,
          limit,
          totalPages,
          prevPage,
          nextPage,
          page,
          hasPrevPage,
          hasNextPage,
          prevLink,
          nextLink,
        },
      });
    } catch (error) {
      logger.error('Error getting products and pagination in products.controller: ' + error);
      return res.status(500).render('errorPage', {
        msg: 'Error getting products and pagination.',
      });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const product = await productsService.getById(id);
      if (product) {
        return res.status(200).json({
          status: 'success',
          message: 'Product by ID found',
          payload: product,
        });
      } else {
        logger.error('Product by ID not found in products.controller (getById)');
        return res.status(404).render('errorPage', {
          msg: 'Product by ID not found.',
        });
      }
    } catch (error) {
      logger.error('Error getting product by id in products.controller: ' + error);
      return res.status(500).render('errorPage', {
        msg: 'Error getting product by id.',
      });
    }
  }

  async getByIdAndUpdate(req, res) {
    try {
      const { id } = req.params;
      const dataToUpdate = req.body;
      const updatedProduct = await productsService.getByIdAndUpdate(id, dataToUpdate);
      if (updatedProduct) {
        return res.status(200).json({
          status: 'success',
          message: 'Product modified successfully',
          payload: updatedProduct,
        });
      } else {
        logger.error('Product by ID not found in products.controller (getByIdAndUpdate)');
        return res.status(404).render('errorPage', {
          msg: 'Product by ID not found.',
        });
      }
    } catch (error) {
      logger.error('Error updating product by ID in products.controller (getByIdAndUpdate): ' + error);
      return res.status(404).render('errorPage', {
        msg: 'Error updating product by ID.',
      });
    }
  }

  async getByIdAndDelete(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await productsService.getByIdAndDelete(id);
      if (deletedProduct) {
        return res.status(200).json({
          status: 'success',
          message: 'Product deleted successfully',
          payload: [],
        });
      } else {
        logger.error('Product by ID not found in products.controller (getByIdAndDelete)');
        return res.status(404).render('errorPage', {
          msg: 'Product by ID not found.',
        });
      }
    } catch (error) {
      logger.error('Error deleting product by ID in products.controller (getByIdAndDelete): ' + error);
      return res.status(500).render('errorPage', {
        msg: 'Error deleting product by ID.',
      });
    }
  }

  async getAllAndRender(req, res) {
    try {
      let user = req.session.user;
      if (!user) {
        user = {
          email: req.user ? req.user.email : req.session.email,
          first_name: req.user ? req.user.first_name : req.session.first_name,
          last_name: req.user ? req.user.last_name : req.session.last_name,
          avatar: req.user ? req.user.avatar : req.session.avatar,
          age: req.user ? req.user.age : req.session.age,
          role: req.user ? req.user.role : req.session.role,
          cartId: req.user ? req.user.cartId : req.session.cartId,
        };
      }
      
      let dashboard;
      if (user.role == 'admin') {
        dashboard = true;
      } else {
        dashboard = false;
      }

      let premium;
      if (user.role == 'premium') {
        premium = true;
      } else {
        premium == false;
      }

      const { currentPage, prodLimit, sort, query } = req.query;
      const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
      const filter = {};
      if (query === 'tablet' || query === 'celphone' || query === 'notebook') {
        filter.category = query;
      }
      if (query === 'available') {
        filter.stock = { $gt: 0 };
      }
      const queryResult = await ProductsMongoose.paginate(filter, {
        sort: sortOption,
        limit: prodLimit || 10,
        page: currentPage || 1,
      });
      let paginatedProd = queryResult.docs;
      const { totalDocs, limit, totalPages, page, pagingCounter, hasPrevPage, hasNextPage, prevPage, nextPage } = queryResult;
      paginatedProd = paginatedProd.map((prod) => ({
        _id: prod._id.toString(),
        title: prod.title,
        description: prod.description,
        price: prod.price,
        thumbnail: prod.thumbnail,
        code: prod.code,
        stock: prod.stock,
        category: prod.category,
      }));
      const prevLink = hasPrevPage ? `/api/products?currentPage=${queryResult.prevPage}&prodLimit=${prodLimit ? prodLimit : ''}&sort=${sort ? sort : ''}&query=${query ? query : ''}` : null;
      const nextLink = hasNextPage ? `/api/products?currentPage=${queryResult.nextPage}&prodLimit=${prodLimit ? prodLimit : ''}&sort=${sort ? sort : ''}&query=${query ? query : ''}` : null;

      const mainTitle = 'ALL PRODUCTS';
      return res.status(200).render('products', {
        user,
        query,
        sort,
        prodLimit,
        mainTitle,
        paginatedProd,
        totalDocs,
        limit,
        totalPages,
        page,
        pagingCounter,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        prevLink,
        nextLink,
        dashboard,
        premium
      });
    } catch (error) {
      logger.error('Failed to fetch products: ' + error);
      return res.status(500).render('errorPage', { msg: 'Error 500. Failed to fetch products.' });
    }
  }

  async renderRealTimeProd(req, res) {
    let user = req.session.user;
    if (!user) {
      user = {
        email: req.user ? req.user.email : req.session.email,
        first_name: req.user ? req.user.first_name : req.session.first_name,
        last_name: req.user ? req.user.last_name : req.session.last_name,
        avatar: req.user ? req.user.avatar : req.session.avatar,
        age: req.user ? req.user.age : req.session.age,
        role: req.user ? req.user.role : req.session.role,
        cartId: req.user ? req.user.cartId : req.session.cartId,
      };
    }
    let dashboard;
    if (user.role == 'admin') {
      dashboard = true;
    } else {
      dashboard = false;
    }
    try {
      const products = await productsService.getAll();
      const plainProducts = products.map((product) => product.toObject());
      const mainTitle = 'REAL TIME PRODUCTS';
      return res.status(200).render('real-time-products', { mainTitle, products: plainProducts, user, dashboard });
    } catch (error) {
      logger.error('Failed to fetch products: ' + error);
      return res.status(500).render('errorPage', { msg: 'Error 500. Failed to fetch products.' });
    }
  }

  async renderCreateProduct(req, res) {
    let user = req.session.user;
    if (!user) {
      user = {
        email: req.user ? req.user.email : req.session.email,
        first_name: req.user ? req.user.first_name : req.session.first_name,
        last_name: req.user ? req.user.last_name : req.session.last_name,
        avatar: req.user ? req.user.avatar : req.session.avatar,
        age: req.user ? req.user.age : req.session.age,
        role: req.user ? req.user.role : req.session.role,
        cartId: req.user ? req.user.cartId : req.session.cartId,
      };
    }
    let dashboard;
    if (user.role == 'admin') {
      dashboard = true;
    } else {
      dashboard = false;
    }
    try {
      return res.status(200).render("create-product", { user, dashboard })
    } catch (e) {
      logger.error('Failed to render create product page: ' + error);
      return res.status(500).render('errorPage', { msg: 'Error 500. Failed to render create product page.' });
    }
  }

  async getByIdAndUpdateStock(req, res) {
    try {
      const { id, stock } = req.params;
      let updateInfo = { stock: stock };
      const updatedProduct = await productsService.getByIdAndUpdate(id, updateInfo);
      if (updatedProduct) {
        return res.status(200).json({
          status: 'success',
          message: `Product's stock was modified successfully`,
          payload: updatedProduct,
        });
      } else {
        logger.error('Product by ID not found in products.controller (getByIdAndUpdateStock)');
        return res.status(404).render('errorPage', {
          msg: 'Product by ID not found.',
        });
      }
    } catch (error) {
      logger.error('Error updating product by ID in products.controller (getByIdAndUpdateStock): ' + error);
      return res.status(404).render('errorPage', {
        msg: 'Error updating product by ID.',
      });
    }
  }

  async getByIdAndUpdatePrice(req, res) {
    try {
      const { id, price } = req.params;
      let updateInfo = { price: price };
      const updatedProduct = await productsService.getByIdAndUpdate(id, updateInfo);
      if (updatedProduct) {
        return res.status(200).json({
          status: 'success',
          message: `Product's price was modified successfully`,
          payload: updatedProduct,
        });
      } else {
        logger.error('Product by ID not found in products.controller (getByIdAndUpdateStock)');
        return res.status(404).render('errorPage', {
          msg: 'Product by ID not found.',
        });
      }
    } catch (error) {
      logger.error('Error updating product by ID in products.controller (getByIdAndUpdateStock): ' + error);
      return res.status(404).render('errorPage', {
        msg: 'Error updating product by ID.',
      });
    }
  }
}

export const productsController = new ProductsController();
