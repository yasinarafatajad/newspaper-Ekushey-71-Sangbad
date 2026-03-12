import newsSchema from "../models/newsSchema.ts";

export const PostNews = async (req, res) => {
  try {
    const { title, url, style, imgUrl } = req.body;
    const Product = await newsSchema.create({
      title,
      url,
      style,
      imgUrl,
    });
    res.status(200).json(Product);
  } catch (err) {
    console.log(err.message);
  }
};

export const GetNews = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductModel.findOne({ _id: id });
    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
  }
};

export const GetAllNews = async (req, res) => {
  try {
    const AllProducts = await ProductModel.find();
    res.status(200).json(AllProducts);
  } catch (err) {
    console.log(err.message);
  }
};

export const DeleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductModel.findOneAndDelete({ _id: id });
    if (!result) {
      res.status(500).json('Product Doesn\'t exist in Database.')
    }
    res.status(200).json("Deleted..!");
  } catch (err) {
    console.log(err.message);
  }
};

export const UpdateNews = async (req, res) =>{
  const formData = req.body;
  try {
    console.log(formData);    
  } catch (err) {
    throw new Error('SERVER: couldn\'t update this news.')
  }
}
