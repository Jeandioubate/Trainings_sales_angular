import { CommonModule } from '@angular/common';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { TrainingService } from './training.service';
import { Training } from '../model/training.model';
import { CartService } from '../services/cart.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SearchBarComponent } from '../search-bar/search-bar-component/search-bar-component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchBarComponent, ReactiveFormsModule],
  templateUrl: './trainings.html',
  styleUrl: './trainings.css',
})
export class Trainings implements OnInit {

  searchKeyword = '';
  selectedCategory = 'all';
  maxPrice?: number;

  categories: string[] = [];

  allTrainings: Training[] = [];

  trainings: Training[] = [];

  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  trainingForm!: FormGroup

  isEditing = false;
  formVisible = false;
  selectedTraining: Training | null = null;


  constructor(
    private trainingService: TrainingService,
    private cartService: CartService,
    private authService: AuthService,
    private fb: FormBuilder,
  private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    console.log('Current user:', this.authService.getAuthenticatedUser());
    //this.isAdmin = this.authService.isAdmin();
    console.log('Is admin?', this.isAdmin);

    this.trainingService.getTrainings().subscribe({
      next: trainings => {
        this.allTrainings = trainings;
        this.trainings = trainings;
        this.initCategories();
        this.cdr.markForCheck();

      },
      error: err => {
        console.error('Erreur API', err);
      }
    });

  this.trainingForm = this.fb.group({
    id: [{ value: null, disabled: false }],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    quantity: [1, Validators.required],
    category: ['', Validators.required],
  });
  }

  initCategories(): void {
    this.categories = [
      ...new Set(this.allTrainings.map(t => t.category))
    ];
  }

  filterTrainings(keyword: string): void {

    this.searchKeyword = keyword.toLowerCase();
    this.applyFilters();
  }
  quantities: { [key: number]: number } = {};

  addToCart(training: Training): void {
    const quantity = this.quantities[training.id] || 1;
    this.cartService.addToCart(training, quantity);
    this.quantities[training.id] = 1;
  }

  applyFilters(): void {
    this.trainings = this.allTrainings.filter(training => {

      const matchKeyword =
        training.name.toLowerCase().includes(this.searchKeyword) ||
        training.description.toLowerCase().includes(this.searchKeyword);

      const matchCategory =
        this.selectedCategory === 'all' ||
        training.category === this.selectedCategory;

      const matchPrice =
        this.maxPrice == null || training.price <= this.maxPrice;

    return matchKeyword && matchCategory && matchPrice;
    });
  }

  addTraining(): void {
    this.isEditing = false;
    this.selectedTraining = null;

    this.trainingForm.reset({
      id: null,
      name: '',
      description: '',
      price: null,
      quantity: 1
    });
  }

  openAddForm(): void {
    this.formVisible = true;
    this.isEditing = false;
    this.selectedTraining = null;
    this.trainingForm.reset({ quantity: 1 });
  }

  editTraining(training: Training): void {
    this.formVisible = true;
    this.isEditing = true;
    this.selectedTraining = training;
    this.trainingForm.patchValue(training);
  }

  saveTraining(): void {
    if (this.trainingForm.invalid) return;

    const training: Training = {
      ...this.trainingForm.getRawValue(),
    };

    if (this.isEditing) {
      this.trainingService.updateTraining(training).subscribe(updated => {
        const i = this.trainings.findIndex(t => t.id === updated.id);
        this.trainings[i] = updated;
        this.cancel();
        this.cdr.markForCheck();
      });
    } else {
      this.trainingService.addTraining(training).subscribe(newTraining => {
        this.trainings.push(newTraining);
        this.cancel();
        this.cdr.markForCheck();
    });
    }
  }

  cancel(): void {
    this.formVisible = false;
    this.isEditing = false;
    this.selectedTraining = null;
    this.trainingForm.reset();
  }

  deleteTraining(id: number): void {
    if (!confirm('Supprimer cette formation ?')) return;

    this.trainingService.deleteTraining(id).subscribe(() => {
      this.trainings = this.trainings.filter(t => t.id !== id);
      this.allTrainings = this.allTrainings.filter(t => t.id !== id);
    });
    this.cdr.markForCheck();
  }
}
