import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as wishlistService from '../../services/wishlistService';

interface WishlistItem {
  _id: string;
  job: {
    _id: string;
    title: string;
    company: {
      name: string;
      logo?: string;
    };
    location: string;
    jobType: string[];
    salary?: {
      min?: number;
      max?: number;
      isNegotiable: boolean;
      currency: string;
    };
    deadline: string;
    status: string;
  };
  createdAt: string;
}

interface WishlistState {
  wishlist: WishlistItem[];
  loading: boolean;
  error: string | null;
  isInWishlist: boolean;
  checkingWishlist: boolean;
}

const initialState: WishlistState = {
  wishlist: [],
  loading: false,
  error: null,
  isInWishlist: false,
  checkingWishlist: false
};

export const addToWishlist = createAsyncThunk(
  'wishlist/add',
  async (jobId: string, thunkAPI) => {
    try {
      const response = await wishlistService.addToWishlist(jobId);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể thêm vào wishlist';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/remove',
  async (jobId: string, thunkAPI) => {
    try {
      const response = await wishlistService.removeFromWishlist(jobId);
      return { ...response, jobId };
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể xóa khỏi wishlist';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getWishlist = createAsyncThunk(
  'wishlist/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await wishlistService.getWishlist();
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể lấy danh sách wishlist';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const checkWishlistItem = createAsyncThunk(
  'wishlist/check',
  async (jobId: string, thunkAPI) => {
    try {
      const response = await wishlistService.checkWishlistItem(jobId);
      return response;
    } catch (error: any) {
      const message = error.response?.data?.msg || error.message || 'Không thể kiểm tra trạng thái wishlist';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    resetWishlistError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state) => {
        state.loading = false;
        state.isInWishlist = true;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.isInWishlist = false;
        // Nếu đang ở trang wishlist, cần xóa job ra khỏi danh sách
        state.wishlist = state.wishlist.filter(
          item => item.job._id !== (action.payload as any).jobId
        );
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Get wishlist
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload.wishlist;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Check if job is in wishlist
      .addCase(checkWishlistItem.pending, (state) => {
        state.checkingWishlist = true;
      })
      .addCase(checkWishlistItem.fulfilled, (state, action) => {
        state.checkingWishlist = false;
        state.isInWishlist = action.payload.isInWishlist;
      })
      .addCase(checkWishlistItem.rejected, (state) => {
        state.checkingWishlist = false;
        state.isInWishlist = false;
      });
  }
});

export const { resetWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;